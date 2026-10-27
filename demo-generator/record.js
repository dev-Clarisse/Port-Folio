const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

// Mêmes conditions que Chrome sur mon PC : écran 1920x1080 avec la mise à l'échelle Windows à 125 %
// => le site voit une fenêtre de 1536x864 et une densité de pixels de 1.25
const VIEWPORT = { width: 1536, height: 864, deviceScaleFactor: 1.25 };

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    // Chrome installé sur le PC : le Chromium fourni avec puppeteer 19 est trop ancien pour Tailwind v4
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: VIEWPORT,
  });

  const page = await browser.newPage();

  const options = {
    followNewTab: true,
    fps: 25,
    // Taille réelle en pixels (1536 x 1.25 = 1920) pour une vidéo aussi nette que l'écran
    videoFrame: {
      width: 1920,
      height: 1080,
    },
    videoCrf: 18,
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
  };

  const recorder = new PuppeteerScreenRecorder(page, options);

  // Chargement de la page avant l'enregistrement pour éviter les premières secondes noires
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1500));

  const savePath = './demo.mp4';
  await recorder.start(savePath);

  // Déplacement de la souris pour faire apparaître le curseur fleur et l'inclinaison des fleurs 3D
  const path = [
    [300, 600], [450, 350], [800, 300], [1150, 330], [1000, 550], [700, 560],
  ];
  await page.mouse.move(path[0][0], path[0][1]);
  for (const [x, y] of path.slice(1)) {
    await page.mouse.move(x, y, { steps: 40 });
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  // Clic sur le bouton "Skills" pour montrer la page des cristaux 3D
  // (on ignore celui du menu mobile, caché sur grand écran)
  const skillsButton = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find(
      b => b.textContent.trim() === 'Skills' && b.checkVisibility({ visibilityProperty: true })
    )
  );
  const box = await skillsButton.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 40 });
  await new Promise(resolve => setTimeout(resolve, 400));
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  // Temps de chargement de la page et d'apparition des cristaux
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Défilement progressif pour faire découvrir tous les cristaux
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel({ deltaY: 40 });
    await new Promise(resolve => setTimeout(resolve, 60));
  }
  await new Promise(resolve => setTimeout(resolve, 2000));

  await recorder.stop();
  await browser.close();

  console.log('Vidéo brute enregistrée avec succès : demo.mp4');
})();
