# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - link "Edusonex ÖdevGPT" [ref=e5] [cursor=pointer]:
      - /url: /
      - img [ref=e7]
      - generic [ref=e9]: Edusonex ÖdevGPT
    - generic [ref=e10]:
      - generic [ref=e11]:
        - heading "Giriş Yap" [level=1] [ref=e12]
        - paragraph [ref=e13]: Hesabınıza giriş yapın ve öğrenmeye devam edin
      - generic [ref=e14]:
        - generic [ref=e15]:
          - text: E-posta
          - generic [ref=e16]:
            - img [ref=e17]
            - textbox "E-posta" [ref=e20]:
              - /placeholder: ornek@email.com
        - generic [ref=e21]:
          - text: Şifre
          - generic [ref=e22]:
            - img [ref=e23]
            - textbox "Şifre" [ref=e26]:
              - /placeholder: ••••••••
        - button "Giriş Yap" [ref=e27] [cursor=pointer]
      - generic [ref=e30]: veya
      - paragraph [ref=e33]:
        - text: Hesabınız yok mu?
        - link "Kayıt Ol" [ref=e34] [cursor=pointer]:
          - /url: /signup
    - link "← Ana Sayfaya Dön" [ref=e36] [cursor=pointer]:
      - /url: /
```