# pip install scipy matplotlib

# from scipy import ndimage
# from scipy import misc
# import matplotlib.pyplot as plt
# face = misc.face( gray=True )
# blurred_face = ndimage.gaussian_filter( face, sigma=3 )
# misc.toimage( blurred_face, cmin=0.0, cmax=1 ).save( 'output.jpg' )

from PILLOW import Image
import numpy as np

w, h = 512, 512
data = np.zeros((h, w, 3), dtype=np.uint8)
data[256, 256] = [255, 0, 0]
img = Image.fromarray(data, 'RGB')
img.save('my.png')
img.show()