# Local Development Setup Guide


## Install an editor

Install a code editor such as [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/), or [VSCode](https://code.visualstudio.com/).

## Git setup

### Create a github account

If you haven't already, create an account on http://github.com/ and login to it.

### Install git and set up ssh keys


Download [git](https://git-scm.com/downloads). With git you can interact with our Github repository. For all intents and purposes you can think of git and Github as the same thing. Git is the version control software, and Github is a popular website for hosting git based projects.

For mac, you will probably be asked to install git with homebrew. Mac's come with homebrew installed so go to your terminal and run `brew install git`. To confirm the install was successful, run `which git`, and you should see a path to `git` (for example `/usr/bin/git`).

Now follow [this tutorial](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) which will allow your local computer to have permissions to interact with our repo. Note that step 4 is a link to a [separate tutorial](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) which you'll need to do as well. This is probably the most involved step of the whole set up, and you'll only ever have to do it once!

Check that it worked:
```sh
ssh -T git@github.com
```

If this test command is non-responsive, you may have a firewall on your computer that is blocking ssh attempts. A work around is provided in [this tutorial](https://docs.github.com/en/github/authenticating-to-github/using-ssh-over-the-https-port).

### Log in to your git account from the terminal
Set your github user name and password from the terminal, following the first two steps in [this guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)



### Clone our repo
Cloning means pulling down a copy of the repo from github.com onto your local machine. You will then be able to interact with the repo from your machine, ie by creating branches and pushing commits (we'll show how later on!)

Open your terminal. On mac: CMD + Space and search for Terminal, on Windows open the Command Prompt. We're going to create a folder on your computer where the repo will reside locally. You're free to put this wherever. For the sake of this tutorial, let's put it in your user's home directory. From the terminal type:

```sh
cd ~
```

and press Enter. `cd` means "change directory", which means we're going to hop into another folder. The `~` is just a shortcut for the home directory. You can always get back to the home directory by running `cd ~`. If you now type `pwd` and Enter, this tells you where you are. So you'll see the home directory path written all out. Now we'll make a directory for our repo:

```sh
mkdir github_projects
```

This makes a folder inside your home folder called `github_projects`. Feel free to call this whatever you like. Now `cd` into `github_projects`:
```sh
cd github_projects
```

Type `ls` and Enter. `ls` shows the contents of the folder. It will show nothing because the folder is empty (we just made it!). Next we'll clone the repo, which will pull down all the repo files into our local folder:


```sh
git clone git@github.com:ward4mutualaid-data/w4madata.git
```

If you receive any error about not being authenticated, check that you've done all of the ssh key steps. After all the files finish downloading, run another `ls`. You should now see a folder called `w4madata`, the name of the repo we just cloned. `cd` into that folder and run another `ls`. You should see all the files corresponding to the repo!

Congrats! You've cloned the repo. Try running some git commands like:
```sh
git branch # shows the current branch (will be `main`)
git log # shows previous commit history - press q to exit
git status
```

Note that git commands only "work" inside of folders that contain a git repo. So if you went back to your home folder (`cd ~`) and tried to run `git status`, you'd get an error, as that directory has not been established as a git project.

Side note - how did we know what to put for `git clone git@github.com....`? For reference, this is available by going to our repo on Github and looking for the green "download" button. Go to the SSH option and click the clipboard to copy the text.

<img width="882" alt="Screen Shot 2021-02-20 at 2 29 58 PM" src="https://user-images.githubusercontent.com/6672955/108608631-4253aa00-7396-11eb-877a-d2dd9e1d7112.png">


## NPM setup

This project is written in React.js. The "js" stands for javascript. NPM (node package manager) is a popular tool for importing third-party javascript libraries into our project. If you look at the `package.json` file in the top level directory of this project, you'll see a list of `dependencies`. These are all modules that our app needs to run.

If you don't have NPM already, download and install it from [here](https://nodejs.org/en/).

Then `cd` to the repo folder and run:
```sh
npm install
```

NPM will look at `package.json` and install everything it needs to.

## AWS Amplify set up

Ask Anna or Aaron to provide you with the aws-exports.js file. Retrieving this file requires AWS Amplify access. Once logged into the amplify console, they will open our app and go to Backend environment > Local setup instructions. Running that command will pull down the aws-exports.js file. Since this command gives you access to our AWS resources, we don't want to share the appId publicly on github!

<img width="1047" alt="Screen Shot 2021-02-20 at 2 47 34 PM" src="https://user-images.githubusercontent.com/6672955/108608641-51d2f300-7396-11eb-963f-484e3624e33d.png">


Have them send you this file securly, and save it into the src/ folder of the repo.

## Start the local app

You should now have everything you need to run the app locally. Just type `npm start` from the top level folder of the repo, and a browser window should pop up, pointing to `localhost:3000`.

If this is your first time using the app, go ahead and create a user name and password.

<img width="698" alt="Screen Shot 2021-02-20 at 3 01 40 PM" src="https://user-images.githubusercontent.com/6672955/108608647-59929780-7396-11eb-934c-872fe88879ec.png">


After logging in, you should see the app!

## Start coding!

You should now have all everything you need to begin developing. Create a new branch for your edits. Do NOT edit directly on `main`!

```sh
git checkout -b my_new_branch
```

If you are working on a specific [issue](https://github.com/ward4mutualaid-data/w4madata/issues), it's good practice to name your branch starting with the issue number, followed by a descriptive name, such as `13_order_view_edit_page` for issue #13.

You can now run `git branch` which will show you a list of branches that you have interacted with. So in this case it will have `main` and whatever your new branch is, and your new branch will be selected. So if you ever need to check which branch you're on, you can always run `git branch`. To switch to another branch, say `main` for example, use `git checkout main`.

Open your editor (Atom/Sublime/VSCode), and open the entire w4madata folder. You should see all the files on the left hand side.

Make your first edits. Making sure _your branch_ is checked out, open up any file in your editor and make some simple changes. Save the file and return to the terminal and type `git status`. You'll see the name of the file you edited shown in red. Type `git diff` and it will show you exactly what changes you made. Git thinks of everything in terms of adding lines and deleting lines. So if you modify a line of code, it will appear as a deletion of the old line (indicated by a red minus sign), and creation of the new line (indicated by a green plus sign.)

Keep editing your files until you are happy\* with them. For example, you might edit some of the js files in  `src/app`. You'll notice that your browser will refresh every time you make a save to a file. This allows you to preview your changes instantaneously.  

Run `git status` and `git diff` one more time to confirm you're happy with your changes, and then type `git add .` (note the period is needed). Run `git status` again and you'll see the files are now written in green. This means they are "staged" to be committed. That's what `git add .` did. You can also choose to add a single file with `git add just_this_file.js`. For example if you're only ready to commit one file. Finally run `git commit -m "hey it's my first commit wooo"`.

Run `git log` and you'll see your commit added to the history. (Type `q` to exit from the git log). Next push your commit to the repo. Note that we are at no risk of overwriting anyone else's work, because we are pushing to _your branch_. So neither the main branch nor anyone else's development branches will be impacted. Go ahead and run `git push --set-upstream origin my_new_branch`. The `--set-upstream ...` tells git to create a remote version of your branch. You will only need to include the `--set-upstream ...` this one time. The `git push` pushes your commit to that remote branch. To push subsequent commits after this one, you can just say `git push`.

From our Github page, open the dropdown list of branches, and you'll see yours listed there now:

<img width="479" alt="Screen Shot 2021-02-20 at 3 11 21 PM" src="https://user-images.githubusercontent.com/6672955/108608650-5eefe200-7396-11eb-9c8e-c12a36f7462a.png">


Select your branch and you'll see it says "this branch is 1 commit ahead of main". That makes sense: you took main and made one commit on top of it. Over on the right hand side it will say "___ Commits". Click on that and you should see your latest commit at the top.


> Keep editing your files until you are happy\* with them.

How often should you create commits? This is pretty much up to you. I like making relatively small commits that correspond to a little chunk of work. If you go too long between committing, you are leaving a lot of time before syncing to the remote repo, which you can think of as saving as a backup. If you commit every few changes, then your commit history can become cluttered. So it's about finding a balance.

Since our app is connected to AWS Amplify, we get a nice benefit called _continuous deployment_. What this means is that when any of us check out a new branch, AWS Amplify will create a live version of our site that corresponds to all committed changes to that branch. Your branch will be live at https://main.d3imjaeqoyytyk.amplifyapp.com/, replacing `main` with your branch name. After pushing a commit, it will redeploy the app which takes a few minutes. After which you can see your changes.


Once you've addressed everything that needs to be done for the Issue, you can create a pull request from your branch. Pull requests > New pull request:

<img width="481" alt="Screen Shot 2021-02-20 at 3 16 44 PM" src="https://user-images.githubusercontent.com/6672955/108608660-6b743a80-7396-11eb-8784-e8512decf7d3.png">


You'll want to put `main` on the left hand side, and your branch on the right. This means "you're merging your changes _into_ main":

<img width="1358" alt="Screen Shot 2021-02-20 at 3 16 07 PM" src="https://user-images.githubusercontent.com/6672955/108608655-657e5980-7396-11eb-8781-8887fdbb8456.png">

In the PR description write `Closes #13` replacing `13` with the issue number you're working on. Github will create a link between your PR and that issue, which has some nice benefits. For the rest of the PR description, feel free to leave additional details about what you changed, or any challenges you faced. You are totally free to open your PR even before your work is done. In that case, open the PR as a "Draft PR". You'll get the benefit of more people seeing your code, without risking someone thinking it's ready to go.

Once your work is done, share the PR link with your teammates on Slack so everyone is aware and so people can give feedback. When ready to merge, click the Merge pull request button down at the bottom.

Awesome! You have just contributed.
