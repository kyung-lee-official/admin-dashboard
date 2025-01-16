# Render Logic

The outmost layer is `AppWrapper`, if one of `publicRoutes` is access, `Sacl` will not get involved, otherwise, `Sacl` will start checking authentication status and redirect to a proper `saclRoutes`, if the user is not authenticated, he or she will not be able to access pages other than `publicRoutes` and `saclRoutes`.

# Todo

-   Add reCAPTCHA
-   Fix Google OAuth redirect page doesn't redirect sporadically
-   Update /member-roles/find API
-   Update /members/find API
-   Update @Patch("/member-verification/:id") -> @Patch("/:id/member-verification")
-   Update @Patch("/profile/:id") -> @Patch("/:id/profile")
-   Update @Patch("/email/:id") -> @Patch("/:id/email")
-   Update @Patch("/roles/:id") -> @Patch("/:id/roles")
-   Update @Patch("/groups/:id") -> @Patch("/:id/groups")
-   Update @Patch("/password/:id") -> @Patch("/:id/password")
-   Update @Patch("/freeze/:id") -> @Patch("/:id/freeze")
-   Update @Patch("/members/transferOwnership/:id") -> @Patch("/members/:id/transfer-ownership"), API response data structure
