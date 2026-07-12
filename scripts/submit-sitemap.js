// scripts/submit-sitemap.js
// Run once after deployment to notify Google of your sitemap
// node scripts/submit-sitemap.js

const https = require('https')

const SITE_URL = 'https://polymer-hub-six.vercel.app'
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`

// Ping Google
const pingGoogle = () => {
  return new Promise((resolve, reject) => {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    https.get(url, (res) => {
      console.log(`✅ Google pinged — Status: ${res.statusCode}`)
      resolve(res.statusCode)
    }).on('error', (err) => {
      console.error('❌ Google ping failed:', err.message)
      reject(err)
    })
  })
}

// Ping Bing
const pingBing = () => {
  return new Promise((resolve, reject) => {
    const url = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    https.get(url, (res) => {
      console.log(`✅ Bing pinged — Status: ${res.statusCode}`)
      resolve(res.statusCode)
    }).on('error', (err) => {
      console.error('❌ Bing ping failed:', err.message)
      reject(err)
    })
  })
}

async function submit() {
  console.log('\n🚀 PolymerHub — Sitemap Submission\n')
  console.log(`Sitemap URL: ${SITEMAP_URL}\n`)

  await Promise.allSettled([pingGoogle(), pingBing()])

  console.log('\n📋 Manual steps (do these now):\n')
  console.log('1. Go to https://search.google.com/search-console')
  console.log('2. Add property: polymer-hub-six.vercel.app')
  console.log('3. Verify ownership (use HTML tag method in Vercel)')
  console.log('4. Go to Sitemaps section')
  console.log(`5. Submit: ${SITEMAP_URL}`)
  console.log('\nDone! Google will crawl your 60 lessons within 1–7 days.\n')
}

submit()
