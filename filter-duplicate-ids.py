import os, json

SAFE_LIST = ['pantry', 'meat-seafood-deli', 'freezer', 'dairy-eggs-fridge', 'bakery', 'drinks', 'international-foods', 'health-beauty']

DATA_PATH = './data/all-products.json'

if __name__ == '__main__':
    products = []
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, 'r', encoding='utf-8') as dataFile:
            products = products + list(json.load(dataFile)['products'])
    for i in range(0, len(products)):
        if products[i]['id'] == '######':
            continue
        for j in range(i+1, len(products)):
            if products[j]['id'] == '######':
                continue
            if products[i]['id'] == products[j]['id']:
                if products[i]['categoryIds'][0] in SAFE_LIST and products[j]['categoryIds'][0] == 'household':
                    products[j]['id'] = '######'
                elif products[i]['categoryIds'][0] == 'household' and products[j]['categoryIds'][0] in SAFE_LIST:
                    products[i]['id'] = '######'
                else:
                    products[i]['categoryIds'] = list(set(products[i]['categoryIds'] + products[j]['categoryIds']))
                    products[j]['id'] = '######'

    lenProducts = len(products)
    i = 0
    while i < lenProducts:
        if products[i]['id'] == '######':
            products.pop(i)
            lenProducts = len(products)
        else:
            i = i + 1

    fileFormat = {
        'products': products,
        'data-date': ''
    }

    print(f'Total {len(products)} products')
    with open('./data/filered-products.json', 'w', encoding='utf-8') as dataFile:
        json.dump(fileFormat, dataFile)
