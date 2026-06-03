import asyncio
import base64
from playwright.async_api import async_playwright

async def capture_screenshots(url: str, num_screenshots: int = 5):
    """
    Navigates to the URL, attempts to dismiss cookie banners, scrolls down the page,
    and captures a sequence of screenshots.
    Returns a list of base64 encoded PNG strings.
    """
    screenshots = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()
        
        try:
            if not url.startswith('http://') and not url.startswith('https://'):
                url = 'https://' + url
                
            await page.goto(url, wait_until='load', timeout=30000)
            
            # Simple heuristic to click cookie/GDPR banners
            accept_texts = ['accept', 'agree', 'got it', 'allow', 'ok']
            for text in accept_texts:
                try:
                    button = page.locator(f"button:has-text('{text}'), a:has-text('{text}')").first
                    if await button.is_visible():
                        await button.click()
                        await page.wait_for_timeout(1000)
                        break
                except Exception:
                    pass

            # Take a single full-page screenshot
            await page.wait_for_timeout(2000) # Wait for animations/lazy loading to settle
            screenshot_bytes = await page.screenshot(type='png', full_page=True)
            base64_img = base64.b64encode(screenshot_bytes).decode('utf-8')
            screenshots.append(base64_img)
                
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            raise e
        finally:
            await browser.close()
            
    return screenshots
