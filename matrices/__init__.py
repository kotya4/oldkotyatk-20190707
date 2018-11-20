#!/usr/bin/python3
from tornado.web import RequestHandler
import numpy as np

# generates random set of integers (1 to 10) and returns as matrix
def gen_random_matrix(w, h):
    return np.random.randint(1, 10, size=(w, h))

# multiplies two matrices
def mul_matrices(m1, m2):
    return np.matmul(m1, m2)


class Handler(RequestHandler):
    def get(self):
        path = '../_templates/matrices_www/index.html'
        # parses arguments
        rows = self.get_argument('rows', None)
        columns = self.get_argument('columns', None)
        answer_type = self.get_argument('answer_type', None)
        # holds all matrices
        matrices = {
            'status': False,
            'err_msg': 'no errors yet',
            'first': None,
            'second': None,
            'multiplication': None,
            'answer_type': None
        }

        # generates matrices
        try:
            rows = int(rows)
            columns = int(columns)
            matrices['status'] = True
            matrices['first'] = gen_random_matrix(rows, columns)
            matrices['second'] = gen_random_matrix(columns, rows)
            matrices['multiplication'] = mul_matrices(matrices['first'], matrices['second'])
            matrices['answer_type'] = int(answer_type)
        # do nothing then failure
        except (ValueError, TypeError) as e:
            matrices['err_msg'] = e

        # renders page and sends object with matrices
        self.render(path, matrices=matrices)


if '__main__' == __name__:
    print('This is "matrices" module. For mor information see "matrices/__init__.py".')
