const puppeteer = require('puppeteer');

async function testCacheBustNavigation() {
    console.log('🧪 Testing navigation with cache busting...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();
    
    try {
        // Clear all cache first
        await page.setCacheEnabled(false);
        
        console.log('📄 Loading page with cache busting...');
        await page.goto(`https://mti-website-final.netlify.app?test=${Date.now()}`, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await page.waitForSelector('.global-nav', { timeout: 10000 });
        
        // Wait for JavaScript to load and execute
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check navigation styles immediately
        const initialCheck = await page.evaluate(() => {
            const nav = document.querySelector('.global-nav');
            const styles = window.getComputedStyle(nav);
            return {
                background: styles.backgroundColor,
                backgroundImage: styles.backgroundImage,
                computedBackground: styles.background
            };
        });
        
        console.log('🎨 Initial navigation styles:');
        console.log(JSON.stringify(initialCheck, null, 2));
        
        // Scroll down and check
        await page.evaluate(() => window.scrollTo(0, 500));
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const afterScrollCheck = await page.evaluate(() => {
            const nav = document.querySelector('.global-nav');
            const styles = window.getComputedStyle(nav);
            return {
                background: styles.backgroundColor,
                backgroundImage: styles.backgroundImage,
                computedBackground: styles.background,
                hasScrolledClass: nav.classList.contains('scrolled'),
                allClasses: Array.from(nav.classList)
            };
        });
        
        console.log('📜 After scroll navigation styles:');
        console.log(JSON.stringify(afterScrollCheck, null, 2));
        
        // Scroll back up
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const backUpCheck = await page.evaluate(() => {
            const nav = document.querySelector('.global-nav');
            const styles = window.getComputedStyle(nav);
            return {
                background: styles.backgroundColor,
                backgroundImage: styles.backgroundImage,
                computedBackground: styles.background,
                hasScrolledClass: nav.classList.contains('scrolled'),
                allClasses: Array.from(nav.classList)
            };
        });
        
        console.log('⬆️  Back to top navigation styles:');
        console.log(JSON.stringify(backUpCheck, null, 2));
        
        // Take screenshot
        await page.screenshot({ 
            path: 'navigation-test-final.png',
            fullPage: false,
            clip: { x: 0, y: 0, width: 1200, height: 100 }
        });
        
        console.log('📸 Screenshot saved as navigation-test-final.png');
        
        // Check if navigation stays dark
        const isDark = !afterScrollCheck.background.includes('255, 255, 255') && 
                      !afterScrollCheck.computedBackground.includes('255, 255, 255');
        
        if (isDark) {
            console.log('✅ SUCCESS: Navigation appears to stay dark!');
        } else {
            console.log('❌ ISSUE: Navigation still appears to turn white');
        }
        
    } catch (error) {
        console.error('❌ Test error:', error);
    } finally {
        console.log('🔍 Keeping browser open for manual inspection...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

testCacheBustNavigation();