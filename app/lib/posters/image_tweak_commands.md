# grid 'em out

    mkdir resized;
    mogrify -path ./resized -resize 1751x1145/! -quality 100 -format jpg *.jpg;
    cd resized;
    convert -append ./0-0.jpg ./0-1.jpg ./0-2.jpg ./0-3.jpg ./0-4.jpg ./0-5.jpg ./0.jpg;
    convert -append ./1-0.jpg ./1-1.jpg ./1-2.jpg ./1-3.jpg ./1-4.jpg ./1-5.jpg ./1.jpg;
    convert -append ./2-0.jpg ./2-1.jpg ./2-2.jpg ./2-3.jpg ./2-4.jpg ./2-5.jpg ./2.jpg;
    convert +append ./0.jpg ./1.jpg ./2.jpg out.jpg;

# thumbs

convert "./*[300x]" -set filename:base "%t.%e" "./thumb/%[filename:base]"