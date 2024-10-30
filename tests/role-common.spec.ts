import { test, expect } from "@playwright/test";
import "dotenv/config";

const {
	E2E_TEST_MEMBER_1_EMAIL,
	E2E_TEST_MEMBER_1_NICKNAME,
	E2E_TEST_MEMBER_2_EMAIL,
	E2E_TEST_MEMBER_2_NICKNAME,
} = process.env;

test.describe("Test Common Role", () => {
	test("Test Common Role", async ({ page }) => {
		/* Sign in page */
		await page.goto("http://localhost:3000/sign-in");
		await page.waitForTimeout(1200); /* Wait for animation */
		await expect(
			page.getByRole("heading", { name: "Sign In", exact: true })
		).toBeVisible();
		await page
			.getByRole("heading", { name: "Sign In", exact: true })
			.hover();
		await page
			.getByPlaceholder("Email", { exact: true })
			.fill(E2E_TEST_MEMBER_1_EMAIL as string);
		await page
			.getByPlaceholder("Password", { exact: true })
			.fill("1234Abcd!");
		await expect(
			page.getByRole("button", { name: "Sign In", exact: true })
		).toBeVisible();
		await page
			.getByRole("button", { name: "Sign In", exact: true })
			.click();
		await page.waitForTimeout(2000); /* Wait for animation */

		await expect(page.locator(".home-drop-down-menu")).toBeVisible();
	});
});
