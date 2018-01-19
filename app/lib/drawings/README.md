# Prep

Here's my image prep system.

## Epson
## Autostitch
## GIMP

    r
    Crop to selection
    Brightness and Contrast
    1200px width
    Export
    Save to... app/lib/drawings/img

## thumbs

    cd app/lib/drawings/img
    convert "./*[400x]" -set filename:base "%t.%e" "./thumb/%[filename:base]"

## drawings.json

    update the drawings.json config

## static pages
  
    cd app/lib/drawings
    node static.node.js

