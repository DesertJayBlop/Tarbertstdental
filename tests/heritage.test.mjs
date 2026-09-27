import test from 'node:test';
import assert from 'node:assert/strict';
import {anniversaryYears} from '../scripts/heritage.js';
test('anniversary advances at New Zealand New Year',()=>{
 assert.equal(anniversaryYears(1897,new Date('2026-09-24T00:00:00Z')),129);
 assert.equal(anniversaryYears(1897,new Date('2026-12-31T10:59:59Z')),129);
 assert.equal(anniversaryYears(1897,new Date('2026-12-31T11:00:00Z')),130);
 assert.equal(anniversaryYears(1897,new Date('2027-12-31T11:00:00Z')),131);
});
