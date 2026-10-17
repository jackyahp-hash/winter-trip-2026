const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const helpers = html.slice(html.indexOf('function routeQuery('), html.indexOf('window.selectRouteNode ='));
const scope = { URLSearchParams };
vm.createContext(scope); vm.runInContext(helpers, scope);
const nodes = [
  {q:'Hong+Kong+International+Airport',name:'香港',leg:'起點'},
  {q:'Narita+Airport+Terminal+2',name:'成田',leg:'✈ 航班'},
  {q:'Tokyo+Station',name:'東京',leg:'🚄 NEX'},
  {q:'東横INN東京駅八重洲北口',name:'酒店',leg:'🚶 步行'}
];
const route = scope.groundRoute(nodes,3,null,'d1223');
const url = new URL(route.external);
assert.equal(url.searchParams.get('travelmode'),'walking');
assert.equal(url.searchParams.get('origin'),'Tokyo Station Yaesu North Exit');
assert.equal(new URL(route.embed).searchParams.get('dirflg'),'w');
assert.equal(new URL(scope.groundRoute(nodes,3,'transit','d1223').embed).searchParams.get('dirflg'),'r');
assert.match(scope.groundRoute(nodes,1,null,'d1223').note,/航班/);
assert(!scope.groundRoute(nodes,1,null,'d1223').external.includes('/dir/'));
assert(!scope.groundRoute(nodes,0,null,'d1223').external.includes('/dir/'));
const alternative=[{q:'hotel',name:'酒店',leg:''},{q:'toyosu',name:'豐洲',leg:''},{q:'manyo',name:'萬葉',leg:''},{q:'hakone',name:'箱根',leg:'🚄'}];
assert.equal(new URL(scope.groundRoute(alternative,3,null,'d1226').external).searchParams.get('origin'),'hotel');
assert(!scope.groundRoute(alternative,2,null,'d1226').external.includes('/dir/'));
assert.equal((html.match(/class="rm-street-iframe"/g)||[]).length,12);
assert.equal((html.match(/class="rm-vector-svg"/g)||[]).length,0);
assert.match(html,/toneMapped: false/);
assert.match(html,/ticket-artifact-controller/);
console.log('PASS: walking/transit URLs, flight and indoor exceptions, alternative day origin, 12 real maps, printed pass colour, ticket enlargement.');
