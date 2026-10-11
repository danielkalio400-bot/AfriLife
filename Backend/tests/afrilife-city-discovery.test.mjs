import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
const city=read("World/Production/AfriLifeCityDiscoveryHud.cs");
const installer=read("Editor/AfriLifeWorldNavigationInstaller.cs");
test("both existing actual city scenes get non-destructive exploration tracker",()=>{
 assert.match(installer,/Upgrade\(AfriLifeTravelCatalog\.LagosScene,"lagos"\)/);
 assert.match(installer,/Upgrade\(AfriLifeTravelCatalog\.AccraScene,"accra"\)/);
 assert.match(installer,/GetComponent<AfriLifeCityDiscoveryHud>\(\)==null/);
 assert.match(installer,/host.AddComponent<AfriLifeCityDiscoveryHud>\(\)/);
 assert.doesNotMatch(installer,/DestroyImmediate|DeleteAsset/);
});
test("physical discovery uses real scene markers, separate currency display, and no fake GHS ledger",()=>{
 assert.match(city,/FirstNeighborhoodInteractionPoint/);
 assert.match(city,/point.Contains\(_player.transform.position\)/);
 assert.match(city,/HashSet<string>/);
 assert.match(city,/GHS \(cedi\)/);
 assert.match(city,/NGN \(naira\)/);
 assert.doesNotMatch(city,/PlayerPrefs|LocalWorldSaveStore\.Save|Wallet\.Deposit|GetMinorUnits/);
});
