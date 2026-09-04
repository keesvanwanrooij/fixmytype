# Installation

Installer instructions will be published only after Windows packaging is verified. Until then, this repository is for development and review, not end-user installation.

## Run the development build

The current build opens the local Settings screen and a tray menu. It does not yet filter or repair text.

```powershell
git clone https://github.com/keesvanwanrooij/fixmytype.git
cd fixmytype/apps/desktop
npm install
npm test
npm start
```

Close the window to hide it in the tray. Choose `Quit FixMyType` from the tray menu to end the development app.

See [README.md](../README.md), [docs hub](README.md), and [delivery overview](../planning/README.md).
