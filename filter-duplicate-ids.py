import os, json

DATA_PATH = './data/all-products.json'

if __name__ == '__main__':
    products = []
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, 'r', encoding='utf-8') as dataFile:
            products = products + list(json.load(dataFile)['products'])
    for i in range(0, len(products)):
        for j in range(i+1, len(products)):
            if products[i]['id'] == products[j]['id']:
                print(products[i]['id'])

