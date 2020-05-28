import os, json

WOOLWORTHS_DIR = './stores/woolworths/data/'
COLES_DIR = './stores/coles/data/'
DATA_DIR = './data/'

if __name__ == '__main__':
    # Merge Coles file
    coles = []
    for filename in os.listdir(COLES_DIR):
        if filename.endswith('.json'):
            with open(f'{COLES_DIR}{filename}', 'r', encoding='utf-8') as f:
                print(json.load(f))
    # Merge Woolworths file
    woolworths = []
    for filename in os.listdir(WOOLWORTHS_DIR):
        if filename.endswith('.json'):
            with open(f'{WOOLWORTHS_DIR}{filename}', 'r', encoding='utf-8') as f:
                woolworths = woolworths + list(json.load(f))
    products = coles + woolworths
    # Write Coles products to a new file
    with open(f'{DATA_DIR}all-products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f)
    print(f'Coles has {len(coles)} products')
    print(f'Woolworths has {len(woolworths)} products')
