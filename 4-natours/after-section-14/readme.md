# SETTING UP GIT AND DEPLOYMENT

## `Table of Contents`

1. [Setting up Git and GitHub](setting-up-git-github)
2. [Git Fundamentals](git-fundamentals)

## `Setting Up Git and GitHub`

So, the Heroku platform, where we're gonna deploy our project, works very closely with git, And so in this lecture, we're gonna install and setup git on our computer and also open an account at github.com.

**What actually git is?**  
well, git is a version control software, so a software that runs on your computer and which basically allows you to save snapshots of your code over time. ---very basic
Each of the project we'll create a repository, and then in there we'll create commits and diff branches.

Let's now go ahead and create an account on github.com  
github is a platform where we can host our own git repositories for free in order to share it with other developers, or just to keep it secure for yourself.  

---

## `Git Fundamentals`

In our local project folder create a new repository

### `Create new git repo`

***git init***  
In order to create new repo we need to navigate to that project folder, and then in there we write git init, so right now we have **a repository with a branch name called master**

### `Create a special file called gitignore`

All that file that shouldn't be in the repo.  
IN .GITIGNORE FILE

```gitignore
node_modules/  
*.env (All .env file)  
```

### `git status`

all the folders that not yet committed to our repo

How we commit files to repo, that's a two step process  
Add that file to so-called staging area, only then we commit all the files.

### `git add -A OR git add .`  

To add(stage) all the files

### `git commit -m "commit message"`

Now we have a local repository with all of our codes committed to it. In the next video lets actually push this brach on github. Hosted on the github account that we just created.

---

## `Pushing to GitHub`

Pushing to a remote branch  
Create new repo on github  

The goal is to basically push all our local code into this remote repo that we just created. In order to be able to do that, we need to let our local repository know about this remote repo that we created. So we have to kind of connect them, that's exactly what is said here. "or push an existing repository from the command line"  

`git remote add origin <https://github.com/muhammad-ahmad66/natours.git>` Paste this to terminal.  
**What this going to do?** It will add a remote brach/repo, and this remote repo is going to be called origin and it's located at this url.  
Now these two repos are connected. At this point we're ready to do git push  

***git push nameOfRemoteBranch nameOfLocalBranch***  
name of remote branch is origin here, name of local branch is master. So,  
`git push origin master`

By the way the opposite operation of push is pull operation. So imagine we're working on two different computers and want to start to work on one computer and then continue on the other one. And so to do that push the code on one computer onto github and then on the other one simply pull it.  
`git pull origin master`

### `Create a README File`

That's a very standard file that every single repository should have.  
The standard name is readme.md, md stands for mark down.  

---
