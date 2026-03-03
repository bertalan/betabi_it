"""Quick visual test: verify theme switching changes accent color."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3001")
    page.wait_for_load_state("networkidle")

    # Screenshot default (neon) theme
    page.screenshot(path="/tmp/theme_neon.png", full_page=False)
    html_class = page.locator("html").get_attribute("class") or ""
    print(f"Default theme classes: {html_class}")

    # Hover config panel to expose it, then click blue theme
    config_btn = page.locator("button[aria-label='Site config']")
    config_btn.hover()
    page.wait_for_timeout(500)

    # Find the blue color swatch and click it
    blue_btn = page.locator("button[aria-label='Theme blue']")
    blue_btn.click()
    page.wait_for_timeout(300)

    html_class = page.locator("html").get_attribute("class") or ""
    print(f"After blue click classes: {html_class}")
    assert "theme-blue" in html_class, f"Expected theme-blue in classes, got: {html_class}"

    page.screenshot(path="/tmp/theme_blue.png", full_page=False)

    # Switch to red
    config_btn.hover()
    page.wait_for_timeout(500)
    red_btn = page.locator("button[aria-label='Theme red']")
    red_btn.click()
    page.wait_for_timeout(300)

    html_class = page.locator("html").get_attribute("class") or ""
    print(f"After red click classes: {html_class}")
    assert "theme-red" in html_class, f"Expected theme-red in classes, got: {html_class}"

    page.screenshot(path="/tmp/theme_red.png", full_page=False)

    # Check that accent color CSS variable changed
    accent = page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim()")
    print(f"Accent color: {accent}")
    assert accent == "#FF3300", f"Expected #FF3300, got {accent}"

    # Verify Apply & Reload button exists
    config_btn.hover()
    page.wait_for_timeout(500)
    reload_btn = page.locator("text=Apply & Reload")
    assert reload_btn.is_visible(), "Apply & Reload button not visible"
    print("Apply & Reload button: VISIBLE ✓")

    print("\n✅ All theme tests passed!")
    browser.close()
