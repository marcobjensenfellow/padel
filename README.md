<p align="center">

  <a href="https://github.com/banjo/feber-enhancer">
    <img src="public/logo.svg" alt="Logo" width="150" style="margin-top: 30px;" >
  </a>

  <p align="center">
    Create free match schedules for a Padel Americano tournament.
    <br />
  </p>
</p>

---

![Feber Enhancer Demo](public/padel-demo.png)

Create match schedules for a Padel Americano completely free of charge. Choose any number of players up to 64 and fill in the scores to calculate the winner.

# Table of Contents

-   [Install](#dart-install)
-   [Features](#heavy_check_mark-features)
-   [Technologies](#clipboard-technologies)
-   [Develop](#cloud-develop)
-   [Contribute](#wrench-contribute)
-   [Deploy](#rocket-deploy)

---

# :dart: Demo

# :heavy_check_mark: Features

-   Create a schedule for Padel Americano
-   Choose between 4 and 64 players
-   Choose maximum points per round (default is 24)
-   Shuffle the schedule
-   Color code the group split when using 16 players
-   Automatically calculate the opponent's points
-   Enter match results to determine the winner
-   Save and load multiple tournaments by name
-   Separate seeding list with drag and drop for Mexicano mode
-   Show which side each player should play and balance "Both" players

# :clipboard: Technologies

-   **Typescript**
-   **Vue**
-   **Vuex**

# :cloud: Develop

```bash
# clone repo
$ git clone https://github.com/banjo/padel.git

# move into folder
$ cd "padel"

# install node modules
$ npm install

# start locally
$ npm run serve

# build app
$ npm run build
```

# :wrench: Contribute

Feel free to contribute, all help is appreciated.

# :rocket: Deploy

Every push to `master` runs a GitHub Actions workflow that builds the project
and publishes the `dist` folder to **GitHub Pages**. Enable Pages under
**Settings → Pages** in the repository and choose GitHub Actions as the source
to make the site available.
