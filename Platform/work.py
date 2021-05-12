import numpy as np

def test_function():
    return np.random.uniform(0, 4, 1000)

def process_string(dim, items, prices, query):
    if dim ==1:
        res = np.zeros(items)
        q = query.strip('[')
        q = q.strip(']')
        q = q.split(',')
        for i in range(items):
            res[i] = float(q[i])
        
        return res
    if dim == 2:
        res = np.zeros((items, prices))
        q = query.split(',')
        vals = [float(i.strip('[').strip(']')) for i in q]
        arr = np.array(vals)
        res = arr.reshape((items, prices))
        return res
