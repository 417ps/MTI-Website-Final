const puppeteer = require('puppeteer');

async function testFreshDeployment() {
    console.log('🚀 Testing fresh deployment at https://mti-website-final.netlify.app');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();
    
    try {
        // Navigate to fresh deployment
        await page.goto('https://mti-website-final.netlify.app', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await page.waitForSelector('.hero-content', { timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshot
        await page.screenshot({ 
            path: 'fresh-deployment-test.png',
            fullPage: false,
            clip: { x: 0, y: 0, width: 1200, height: 600 }
        });
        
        // Analyze layout
        const layoutCheck = await page.evaluate(() => {
            const heroContent = document.querySelector('.hero-content');
            const title = document.querySelector('.hero-title');
            const subtitle = document.querySelector('.hero-subtitle');
            const description = document.querySelector('.hero-description');
            const button = document.querySelector('.hero-button');
            
            const getPosition = (element) => {
                if (!element) return null;
                const rect = element.getBoundingClientRect();
                return {
                    left: Math.round(rect.left),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                };
            };
            
            return {
                viewportWidth: window.innerWidth,
                content: getPosition(heroContent),
                title: getPosition(title),
                subtitle: getPosition(subtitle),  
                description: getPosition(description),
                button: getPosition(button),
                isLeftAligned: heroContent ? heroContent.getBoundingClientRect().left < (window.innerWidth * 0.4) : false
            };
        });
        
        console.log('📊 Fresh Deployment Layout Analysis:');
        console.log(`Viewport width: ${layoutCheck.viewportWidth}px`);
        console.log(`Content position: ${layoutCheck.content?.left}px from left`);
        console.log(`Title position: ${layoutCheck.title?.left}px from left`);
        console.log(`Subtitle position: ${layoutCheck.subtitle?.left}px from left`);
        console.log(`Description position: ${layoutCheck.description?.left}px from left`);
        console.log(`Button position: ${layoutCheck.button?.left}px from left`);
        console.log(`Left aligned: ${layoutCheck.isLeftAligned}`);
        
        if (layoutCheck.isLeftAligned && layoutCheck.content?.left < 100) {
            console.log('🎉 SUCCESS! Fresh deployment shows proper left alignment!');
            console.log('✅ Hero content is positioned correctly on the left side');
            return true;
        } else {
            console.log('❌ ISSUE: Fresh deployment still shows alignment problems');
            console.log(`Content is at ${layoutCheck.content?.left}px, should be under 100px`);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error testing fresh deployment:', error);
        return false;
    } finally {
        console.log('🔍 Keeping browser open for visual inspection...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// Install puppeteer if needed then test
async function runTest() {
    try {
        require('puppeteer');
        return await testFreshDeployment();
    } catch (error) {
        console.log('📦 Installing puppeteer...');
        const { execSync } = require('child_process');
        execSync('npm install puppeteer', { stdio: 'inherit' });
        return await testFreshDeployment();
    }
}

runTest().then(success => {
    if (success) {
        console.log('🎯 Fresh deployment test PASSED!');
    } else {
        console.log('⚠️  Fresh deployment test needs attention');
    }
});