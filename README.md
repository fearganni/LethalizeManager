# Lethalize Manager

![Image](https://github.com/fearganni/LethalizeManager/releases/download/0.0.1/background.png)

Lethalize Manager: A user-friendly application for seamlessly managing and updating game mods, born from a simple PowerShell script.

## Prelude

Hello and a warm welcome to the GitHub repository of Lethalize Manager! This project sprang to life from a simple need: my friends and I wanted a seamless way to manage and automatically update our game mods.

It all began as a fork from a humble PowerShell script, initially meant for installing mods from Thunderstore. But let's be honest, executing a PowerShell script for this purpose felt a tad... let's say, 'unconventional.' So, I decided to step it up a notch and craft a full-fledged application that caters to all our modding whims and desires.

Feel free to dive in and use this application! I'm open to gently expanding its horizons, so if you have any brilliant ideas or suggestions, don't hesitate to raise an issue or, better yet, submit a pull request.

Thanks for dropping by the repo, and happy modding!

## Development

This repository, a fork from [maximegris/angular-electron](https://github.com/maximegris/angular-electron), operates with Angular v16.1.3 and Electron v25.2.0, blending modern web technologies for an enhanced application experience.

### Getting Started

_Clone this repository locally:_

```bash
git clone https://github.com/maximegris/angular-electron.git
```

_Install dependencies with npm (used by Electron renderer process):_

```bash
npm install
```

There is an issue with `yarn` and `node_modules` when the application is built by the packager. Please use `npm` as dependencies manager.

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

```bash
npm install -g @angular/cli
```

_Install NodeJS dependencies with npm (used by Electron main process):_

```bash
cd app/
npm install
```

Why two package.json ? This project follow [Electron Builder two package.json structure](https://www.electron.build/tutorials/two-package-structure) in order to optimize final bundle and be still able to use Angular `ng add` feature.

### To build for development

- **in a terminal window** -> npm start

Voila! You can use your Angular + Electron app in a local development environment with hot reload!

The application code is managed by `app/main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200), and an Electron window. \
The Angular component contains an example of Electron and NodeJS native lib import. \
You can disable "Developer Tools" by commenting `win.webContents.openDevTools();` in `app/main.ts`.

### Project structure

| Folder | Description                                      |
| ------ | ------------------------------------------------ |
| app    | Electron main process folder (NodeJS)            |
| src    | Electron renderer process folder (Web / Angular) |

### How to import 3rd party libraries

This sample project runs in both modes (web and electron). To make this work, **you have to import your dependencies the right way**. \

There are two kind of 3rd party libraries :

- NodeJS's one - Uses NodeJS core module (crypto, fs, util...)
  - I suggest you add this kind of 3rd party library in `dependencies` of both `app/package.json` and `package.json (root folder)` in order to make it work in both Electron's Main process (app folder) and Electron's Renderer process (src folder).

Please check `providers/electron.service.ts` to watch how conditional import of libraries has to be done when using NodeJS / 3rd party libraries in renderer context (i.e. Angular).

- Web's one (like bootstrap, material, tailwind...)
  - It have to be added in `dependencies` of `package.json  (root folder)`

### Add a dependency with ng-add

You may encounter some difficulties with `ng-add` because this project doesn't use the defaults `@angular-builders`. \
For example you can find [here](HOW_TO.md) how to install Angular-Material with `ng-add`.

### Browser mode

Maybe you only want to execute the application in the browser with hot reload? Just run `npm run ng:serve:web`.

### Included Commands

| Command                  | Description                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `npm run ng:serve`       | Execute the app in the web browser (DEV mode)                                                         |
| `npm run web:build`      | Build the app that can be used directly in the web browser. Your built files are in the /dist folder. |
| `npm run electron:local` | Builds your application and start electron locally                                                    |
| `npm run electron:build` | Builds your application and creates an app consumable based on your operating system                  |

**Your application is optimised. Only /dist folder and NodeJS dependencies are included in the final bundle.**

### You want to use a specific lib (like rxjs) in electron main thread ?

YES! You can do it! Just by importing your library in npm dependencies section of `app/package.json` with `npm install --save XXXXX`. \
It will be loaded by electron during build phase and added to your final bundle. \
Then use your library by importing it in `app/main.ts` file. Quite simple, isn't it?

### E2E Testing

E2E Test scripts can be found in `e2e` folder.

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run e2e` | Execute end to end tests |

Note: To make it work behind a proxy, you can add this proxy exception in your terminal  
`export {no_proxy,NO_PROXY}="127.0.0.1,localhost"`

### Debug with VsCode

[VsCode](https://code.visualstudio.com/) debug configuration is available! In order to use it, you need the extension [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

Then set some breakpoints in your application's source code.

Finally from VsCode press **Ctrl+Shift+D** and select **Application Debug** and press **F5**.

Please note that Hot reload is only available in Renderer process.

### Want to use Angular Material ? Ngx-Bootstrap ?

Please refer to [HOW_TO file](./HOW_TO.md)
