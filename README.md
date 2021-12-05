# Setting Up the Project

#### Everything here needs to be done in a Linux or MacOS environment. I recommend downloading and installing WSL2 for Windows 10/11.

## Create / open your bashrc environment file

- `cd ~` should bring you to your root folder in your Linux instance
- Run `ls -al` and see if there is a `.bashrc` file
- If there is open it. You can do this in a code editor such as VSCode or in the terminal by running `nano .bashrc`
- Else run `touch .bashrc` to create the file and then open it
- Leave this file open as things will be added to it as necessary in further steps

## Create and navigate to a dev directory

- Run `mkdir dev && cd dev && mkdir mudl && cd mudl`

## Install NVM (node version manager)

- run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
- Paste the below exports into your `.bashrc` file and save it

  ```
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  ```

- Source the file by running `source .bashrc`
- You can now run `nvm use {{NODE_VERSION}}` to quickly switch between different versions of node that you have installed locally.
- You can also run `nvm install {{NODE_VERSION}}` to quickly install new version of NodeJS.

## Install NodeJS

- Run `nvm install 14.15.5`

## Install npx

- Run `npm i npx`

## Add necessary environment variables

- Reach out to me so I can send these to you since they are secrets. You will add them to your `.bashrc` file.

## Clone the repository and install necessary packages

- Run `git clone git@github.com:oFrusch/mixology-frontend.git`
- Navigate to the frontend directory: `cd mixology-frontend`
- Run `npm i` in this directory in order to install the necessary packages
  - The `node-sass` package loves to create problems here, so if you are getting any errors when running this command then feel free to reach out to me and I should be able to help get through them.

# Useful Scripts

### upreact

Sets the correct node version and starts the frontend dev server in one command

- Navigate to `/usr/local/bin` and run `touch upreact` and then `nano upreact`
- Paste in

  ```
  #!/bin/bash

  cd ~/dev/mudl/mixology-frontend
  nvm use 14
  npm start
  ```

- Save the file and then exit your nano window
- You can now run `source upreact` from any directory to start your frontend dev server

### openmudlfe

This just opens up VSCode with all the files for the frontend

- Navigate to `/usr/local/bin` and run `touch openmudlfe` and then `nano openmudlfe`
- Paste in
  ```
  cd ~/dev/mudl/mixology-frontend;
  code .;
  ```

# Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
