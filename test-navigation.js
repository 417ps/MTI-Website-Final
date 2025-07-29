const puppeteer = require('puppeteer');

async function testNavigation() {
    console.log('🔍 Testing all navigation links on complete website...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();
    
    const baseUrl = 'https://mti-website-final.netlify.app';
    const pages = [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'About', url: `${baseUrl}/about-dark.html` },
        { name: 'Projects', url: `${baseUrl}/projects-dark.html` },
        { name: 'Team', url: `${baseUrl}/team-dark.html` },
        { name: 'Contact', url: `${baseUrl}/contact-dark.html` }
    ];
    
    try {
        for (const pageInfo of pages) {
            console.log(`\n📄 Testing ${pageInfo.name} page...`);
            
            const response = await page.goto(pageInfo.url, { 
                waitUntil: 'networkidle2',
                timeout: 15000 
            });
            
            if (response.status() === 200) {
                console.log(`✅ ${pageInfo.name}: Page loads successfully`);
                
                // Wait for content to load
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if page has expected content
                const hasContent = await page.evaluate(() => {
                    const nav = document.querySelector('.global-nav');
                    const content = document.body.innerHTML.length;
                    return nav && content > 1000;
                });
                
                if (hasContent) {
                    console.log(`✅ ${pageInfo.name}: Content loaded properly`);
                } else {
                    console.log(`⚠️  ${pageInfo.name}: Content may be incomplete`);
                }
                
            } else {
                console.log(`❌ ${pageInfo.name}: HTTP ${response.status()}`);
            }
        }
        
        // Test navigation links from homepage
        console.log('\n🔗 Testing navigation links from homepage...');
        await page.goto(`${baseUrl}/`);
        await page.waitForSelector('.nav-menu');
        
        const navLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('.nav-link');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.href
            }));
        });
        
        console.log('📋 Navigation links found:');
        navLinks.forEach(link => {
            console.log(`  • ${link.text}: ${link.href}`);
        });
        
        console.log('\n🎉 Navigation test complete!');
        console.log('🌐 Complete website available at: https://mti-website-final.netlify.app');
        
    } catch (error) {
        console.error('❌ Navigation test error:', error);
    } finally {
        console.log('🔍 Keeping browser open for manual verification...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

testNavigation();