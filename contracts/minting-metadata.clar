;; Artefy Minting & Metadata Contract
;; NFT creation and metadata linking for digital/physical art

(define-trait sip009-nft-trait
  (
    ;; transfer token
    (transfer (uint principal principal) (response bool uint))
    ;; get balance of tokens held by principal
    (get-balance (principal) (response uint uint))
    ;; get owner of a token
    (get-owner (uint) (response (optional principal) uint))
    ;; get last token id minted
    (get-last-token-id () (response uint uint))
    ;; get token URI/metadata
    (get-token-uri (uint) (response (optional (string-utf8 256)) uint))
  )
)

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-TOKEN-NOT-FOUND u101)
(define-constant ERR-NOT-OWNER u102)
(define-constant ERR-METADATA-TOO-LONG u103)

(define-data-var last-token-id uint u0)
(define-data-var contract-owner principal tx-sender)

(define-map token-owner ((token-id uint)) principal)
(define-map token-uri ((token-id uint)) (string-utf8 256))
(define-map owner-token-count principal uint)

;; Check if caller is contract owner
(define-private (is-owner (caller principal))
  (is-eq caller (var-get contract-owner)))

;; Mint a new token with metadata URI
(define-public (mint (to principal) (uri (string-utf8 256)))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-NOT-AUTHORIZED))
    (asserts! (<= (len uri) u256) (err ERR-METADATA-TOO-LONG))
    (let ((next-id (+ (var-get last-token-id) u1)))
      (map-set token-owner ((token-id next-id)) to)
      (map-set token-uri ((token-id next-id)) uri)
      (var-set last-token-id next-id)
      (let ((count (default-to u0 (map-get? owner-token-count to))))
        (map-set owner-token-count to (+ count u1)))
      (ok next-id))))

;; Transfer a token to another user
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (match (map-get? token-owner ((token-id token-id)))
      owner
        (begin
          (asserts! (is-eq owner sender) (err ERR-NOT-OWNER))
          (asserts! (is-eq tx-sender sender) (err ERR-NOT-AUTHORIZED))
          (map-set token-owner ((token-id token-id)) recipient)
          ;; update sender and recipient balances
          (let ((sender-count (default-to u0 (map-get? owner-token-count sender))))
            (map-set owner-token-count sender (if (> sender-count u0) (- sender-count u1) u0)))
          (let ((recipient-count (default-to u0 (map-get? owner-token-count recipient))))
            (map-set owner-token-count recipient (+ recipient-count u1)))
          (ok true))
      (err ERR-TOKEN-NOT-FOUND))))

;; Get token balance of an owner
(define-read-only (get-balance (who principal))
  (ok (default-to u0 (map-get? owner-token-count who))))

;; Get owner of a token
(define-read-only (get-owner (token-id uint))
  (ok (map-get? token-owner ((token-id token-id)))))

;; Get last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id)))

;; Get token URI
(define-read-only (get-token-uri (token-id uint))
  (ok (map-get? token-uri ((token-id token-id)))))

;; Transfer ownership of the contract
(define-public (transfer-contract-ownership (new-owner principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-NOT-AUTHORIZED))
    (var-set contract-owner new-owner)
    (ok true)))
