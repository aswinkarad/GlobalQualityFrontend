pull
_________________________________________
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/aswinkarad/GlobalQualityFrontend.git
git pull origin main --allow-unrelated-histories
git fetch origin
git reset --hard origin/main

_____________________________
push 
__________________________
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/aswinkarad/GlobalQualityFrontend.git
git push -u origin main
