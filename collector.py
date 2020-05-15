from os import path
from shutil import copy2

CATEGORY_PATH = './stores/woolworths/categories.json'
DATA_DIR = './data'
WOOLWORTHS_PATH = './stores/woolworths/woolworths-products.json'

if __name__ == '__main__':
    if path.exists(CATEGORY_PATH):
        copy2(CATEGORY_PATH,DATA_DIR)
        print('Found Categories. Move to data folder.')
