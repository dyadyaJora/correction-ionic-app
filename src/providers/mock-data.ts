import { PsyTest } from './psy-test';

export const TESTS: PsyTest[] = [
  // {
  //   id: 0,
  //   name: 'Демо',
  //   description: 'lorem',
  //   duration: 1*60*1000,
  //   levels: 1,
  //   tags: ['tag1', 'tag2']
  // },
  // {
  //   id: 1,
  //   name: 'Монотония',
  //   description: 'lorem',
  //   duration: 1*60*45000,
  //   levels: 1,
  //   tags: ['tag1', 'tag2']
  // },
  // {
  //   id: 2,
  //   name: 'ПЭН',
  //   description: 'lorem',
  //   duration: 1*60*15000,
  //   levels: 1,
  //   tags: ['tag1', 'tag2']
  // },
  {
    id: 3,
    name: 'САН',
    description: 'тут будет описание',
    duration: null,
    levels: 1,
    tags: ['tag1', 'tag2']
  },
  {
    id: 4,
    name: 'Тест Люшера',
    description: 'тут будет описание',
    duration: 1*60*5000,
    levels: 1,
    tags: ['tag2', 'tag3']
  }
];