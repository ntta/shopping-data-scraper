import os, json

DATA_PATH = './data/all-products.json'

if __name__ == '__main__':
    products = []
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, 'r', encoding='utf-8') as dataFile:
            products = products + list(json.load(dataFile)['products'])

    newProducts = []
    for i in range(0, len(products)):
        product = products[i]
        categoryIds = [product['categoryId']]
        del product['categoryId']
        product['categoryIds'] = categoryIds
        newProducts.append(product)


    fileFormat = {
        'products': newProducts,
        'data-date': '09-06-2020'
    }
    
    with open('./data/new-products.json', 'w', encoding='utf-8') as dataFile:
        json.dump(fileFormat, dataFile)



