# codenut-cli
#### A simple cli for codenut project

### Installation
```
npm install -g codenut-cli
```

### Usage
```
nut create <component>
nut page <path>
nut generate webfont <font-path> <dest>

# mac os
brew install imagemagick

# window
visit https://www.imagemagick.org/script/download.php
download ImageMagick-7.0.7-14-Q16-x64-dll.exe 

# image size : 1024 x 1024
nut generate appicon <img-path>
```

### Example
```
nut create textfield
nut page component/contact-us
nut generate webfont 'font/heveltica.ttf' 'heveltica'
nut generate webfont 'font/*.ttf' 'heveltica'
nut generate appicon './icon.png'
```