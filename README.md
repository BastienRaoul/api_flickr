Command line instructions
Git global setup

git config --global user.name "Bastien RAOUL"
git config --global user.email "bastien.raoul@etu.univ-nantes.fr"

Create a new repository

git clone https://gitlab.univ-nantes.fr/E174687C/flickr.git
cd flickr
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master

Existing folder

cd existing_folder
git init
git remote add origin https://gitlab.univ-nantes.fr/E174687C/flickr.git
git add .
git commit -m "Initial commit"
git push -u origin master

Existing Git repository

cd existing_repo
git remote rename origin old-origin
git remote add origin https://gitlab.univ-nantes.fr/E174687C/flickr.git
git push -u origin --all
git push -u origin --tags