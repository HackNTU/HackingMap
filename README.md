# HackingMap

## Introduction
HackingMap is a realtime map of project for hackathon events. Hackers can post, update and share their project with each other. With the `heart` and `star` icon, anyone login with Facebook can vote for projects they like. 

HackingMap for HackNTU2017: https://hackntu.github.io/HackingMap/#/projects

## Features
### Post a project and embed custom content
![](https://i.imgur.com/GmP0NUh.gif)

### Revel project on map
![](https://i.imgur.com/yEvF2LB.gif)

### Project status filter
![](https://i.imgur.com/fnBtLzz.gif)

<style>
img {
    border: 1px solid Grey;
}
</style>

## Tools
- Vue.js 2.0
    - A prograssive front-end framework perfact for single-page applications. Check out [vue-cli Webpack boilerplate](https://vuejs-templates.github.io/webpack/) for the project structure.
- Firebase 
    - We use [Firebase Realtime Database](https://firebase.google.com/docs/database/web/start) and [VueFire](https://github.com/vuejs/vuefire) to achieve the dynamic update of project content and ranking.
- ElementUI
    - A Vue based component/UI library, check out [ElementUI vue components](http://element.eleme.io/#/zh-CN/component/installation) for all avalible components.
- Airtable
    - The full schedule of hackathon is co-edited in an Airtable base and display on the right column (Desktop only), with the current event highlighted. Check out [Airtable API](https://airtable.com/api).


## Usage
```
# Clone the project
git clone https://github.com/HackNTU/HackingMap.git && cd hackingmap

# Install dependancies
yarn

# (optional) Create a Firebase project and modify src/appconfig.js accordingly

# Develope
yarn dev

# Build
yarn build
```
