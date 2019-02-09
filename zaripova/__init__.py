#!/usr/bin/python3
# -*- coding: utf-8 -*-
import json, random, os
from tornado.web import RequestHandler


MODULE_PATH = os.path.dirname(os.path.realpath(__file__)) + '/'


class MarkovChain:
    """ Generates random text """

    def __init__(self, seq_len = 1):
        self.seq_len = seq_len

    def load_from_json(self, dic, tree):
        self.dic = json.loads(dic)
        self.tree = json.loads(tree)

    def load_from_file(self, dic, tree):
        with open(MODULE_PATH + dic, 'r', encoding='utf8') as f1:
            dic = f1.read()
        with open(MODULE_PATH + tree, 'r', encoding='utf8') as f2:
            tree = f2.read()
        if f1.closed and f2.closed:
            self.load_from_json(dic, tree)
            return True
        return False

    def search_seq(self, seq):
        for n in range(len(self.tree)):
            k = 0
            flg = True
            for e in self.tree[n]['seq']:
                if e != seq[k]:
                    flg = False
                    break
                k += 1
            if flg:
                return n
        return self.get_first_sentence()

    def get_first_sentence(self):
        indices = []
        for i in range(len(self.tree)):
            if 0 == self.tree[i]['seq'][0]:
                indices.append(i)
        return random.choice(indices)

    def interpret_word(self, word):
        o = {
            'word': ' ' + word,
            'was_period': False,
            'was_comma': False
        }
        if 'PERIOD' == word:
            o['was_period'] = True
            o['word'] = '.'
        elif 'COMMA' == word:
            o['was_comma'] = True
            o['word'] = ','
        return o

    def get_next_index(self, i):
        score = random.randint(0, self.tree[i]['max_weight'] - 1)
        for element in self.tree[i]['next']:
            if score < element['weight']:
                return element['index']
            else:
                score -= element['weight']
        raise ValueError('Element was not chosen.')

    def puke(self, sentence_num = 1, max_chars = 10000):
        tree_index = self.get_first_sentence()
        text = ''
        # pushes first 'seq_len - 1'-number of words from the
        # end of 'seq' in the 'text'.
        for i in range(self.seq_len - 1, 0, -1):
            text += ' ' + self.dic[self.tree[tree_index]['seq'][i]]
        text = text[1:2].upper() + text[2:]
        # iterates through the 'tree' to generate endles row
        # of data.
        upper_flg = False
        while max_chars > 0:
            max_chars -= 1
            word_index = self.get_next_index(tree_index)
            o = self.interpret_word(self.dic[word_index])
            if upper_flg:
                upper_flg = False
                text += ' ' + o['word'][1:2].upper() + o['word'][2:]
            else:
                text += o['word']
            # stops then needed amount of sentences generated.
            if o['was_period']:
                upper_flg = True
                sentence_num -= 1
                if sentence_num <= 0:
                    return text
            # generates the sequence that needs to be
            # founded in 'tree'.
            seq = self.tree[tree_index]['seq'][1:] + [word_index]
            tree_index = self.search_seq(seq)
        return text


class HeaderGen:
    """ Generates chapter header """

    def __init__(self):
        self.endings = {
            'S': ('ый', 'ая', 'ое', 'ого', 'ой', 'ом', 'ой'),
            'W': ('ий', 'ая', 'ее', 'его', 'ей', 'ем', 'ей')
        }

    def load_from_json(self, data):
        self.dic = json.loads(data)

    def load_from_file(self, filename):
        with open(MODULE_PATH + filename, 'r', encoding='utf8') as f:
            data = f.read()
            self.load_from_json(data)
        return f.closed

    def get_word(self, as_adj, wcase, gender):
        word = ''
        index = random.randint(0, len(self.dic) - 1)
        if as_adj:
            ending = 'ERROR'
            e = self.endings[self.dic[index]['adj_form']]
            if 0 == wcase:
                if 'M' == gender:
                    ending = e[0]
                elif 'F' == gender:
                    ending = e[1]
                else:
                    ending = e[2]
            elif 0 == wcase:
                if 'M' == gender or 'N' == gender:
                    ending = e[3]
                else:
                    ending = e[4]
            else:
                if 'M' == gender or 'N' == gender:
                    ending = e[5]
                else:
                    ending = e[6]
            word = self.dic[index]['adj'] + ending;
        else:
            word = self.dic[index]['word'][wcase];
        return {
            'word': word,
            'gender': self.dic[index]['gen']
        }

    def get_phrase(self, wcase):
        text = ''
        noun = self.get_word(False, wcase, '')
        adj = self.get_word(True, wcase, noun['gender'])
        if 0 != random.randint(0, 3):
            text += adj['word'] + ' '
        text += noun['word']
        return text

    def get_sentence(self):
        text = self.get_phrase(0)
        if 0 == random.randint(0, 2):
            return text
        if 0 == random.randint(0, 4):
            text += ' ' + self.get_phrase(1)
            if 0 == random.randint(0, 2):
                return text
        text += ' в ' + self.get_phrase(2)
        if 0 == random.randint(0, 2):
            return text
        text += ' и ' + self.get_phrase(2)
        return text

    def puke(self, max_num = 3):
        text = ''
        glued_once = False
        num = random.randint(1, max_num)
        for i in range(num):
            if i > 0:
                if not glued_once:
                    if 0 == random.randint(0, 2):
                        glued_once = True
                        text += ' как ' if 0 == random.randint(0, 3) else ' и '
                        text += self.get_sentence()
                        continue
                text += '. '
            s = self.get_sentence()
            text += s[0].upper() + s[1:]
        return text + '.'


markov_chain = None
header_gen = None


def init():
    global markov_chain, header_gen
    markov_chain = MarkovChain(2)
    header_gen = HeaderGen()
    flg1 = markov_chain.load_from_file('dictionary.txt', 'tree.txt')
    flg2 = header_gen.load_from_file('headers.txt')
    return flg1 and flg2


def gen(seed):
    global markov_chain, header_gen
    random.seed(seed)
    header = header_gen.puke(3)
    text = markov_chain.puke(100)
    return { 'header': header, 'body': text }


init()


class Handler(RequestHandler):
    """ Handles zaripova.html """
    def get(self):
        path = '../_templates/www_zaripova/index.html'
        text = { 'header': '', 'body': '' }
        page = self.get_argument('page', '1')
        try:
            page = int(page)
            text = gen(page + 4)
        except (ValueError, TypeError) as e:
            page = 'intro'
        self.render(path, header=text['header'], body=text['body'], page=page)



if '__main__' == __name__:
    print(gen(random.randint(0, 0xffff)))
