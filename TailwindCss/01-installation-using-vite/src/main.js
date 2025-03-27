import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div class="card bg-base-100 w-96 shadow-sm">
      <figure>
      <a href="https://vite.dev" target="_blank">
          <img src="${viteLogo}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
          <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
        </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
          <img src="https://img.daisyui.com/images/daisyui-logo/daisyui-logomark-1024-1024.png" class="logo vanilla" alt="JavaScript logo" />
        </a>
      </figure>
      <div class="card-body">
        <h2 class="card-title">Hello Vite + Tailwind + Daisy UI</h2>
        <p>www.nandysagar.in</p>
        <div class="card-actions justify-end">
          <button type="button" class="btn btn-primary" id="counter"></button>
        </div>
      </div>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
