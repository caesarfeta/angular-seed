My image prep system in reminder snippets.

## Epson

    Scan 300dpi

## Autostitch

    Use autostitch for really large scanned images

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

## build static pages

    cd app/lib/drawings
    node static.node.js

## get size of image

    identify file.jpg | cut -d " " -f 3

## crop

    convert "./file.jpg" -crop 500x500+500+500 file_cropped.jpg
    convert "[ input ]" -crop [xWidth x yWidth + xOffset + yOffset ] "[ output ]"

## brightness & contrast

    convert -brightness-contrast 50x20 in.jpg out.jpg

## rotate

    convert -rotate "90" in.jpg out.jpg

## make transparent

    convert "./transparent/input.png" -transparent white ./transparent/output.png
    convert "./transparent/input.png" -fuzz 10% -transparent white ./transparent/output.png

## grid crop

    convert output.png -crop 75x192 +repage +adjoin output_%02d.png
    convert output.png -crop 14x8@ +repage +adjoin output_%02d.png

## transparency cleanup

    TODO!

## boundary box detection

### install on osx

    git clone --recursive https://github.com/philipperemy/yolo-9000.git
    cd yolo-9000
    cat yolo9000-weights/x* > yolo9000-weights/yolo9000.weights # it was generated from split -b 95m yolo9000.weights
    md5 yolo9000-weights/yolo9000.weights # d74ee8d5909f3b7446e9b350b4dd0f44  yolo9000.weights
    cd darknet 
    git reset --hard b61bcf544e8dbcbd2e978ca6a716fa96b37df767
    make # Will run on CPU. For GPU support, scroll down!

### run

    ./darknet detector test cfg/combine9k.data cfg/yolo9000.cfg ../yolo9000-weights/yolo9000.weights data/horses.jpg

### train YOLO for custom image detection

    http://guanghan.info/blog/en/my-works/train-yolo/


