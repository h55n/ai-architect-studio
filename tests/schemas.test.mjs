import test from 'node:test'
import assert from 'node:assert/strict'
import {validateDesignSpec, safeValidateDesignSpec, validateArchitectBrief} from '../src/lib/designSchema.ts'
import {validateQuizResponse, safeValidateQuizResponse, UserProfileSchema} from '../src/lib/profileSchema.ts'
const room={position:{x:1,y:0,z:2},dimensions:{width:5,height:3,depth:4},name:'Bedroom',color:'#FDF8E2'}
const design={architecturalStyle:{name:'Modern'},floors:[{level:0,rooms:[room]}]}
test('design defaults preserve nested geometry and palette',()=>{
 const parsed=validateDesignSpec(design);const r=parsed.floors[0].rooms[0];assert.equal(r.name,'Bedroom');assert.equal(r.dimensions.width,5);assert.equal(r.position.z,2);assert.deepEqual(r.doors,[]);assert.equal(r.shape,'rect');assert.deepEqual(parsed.palette,['#C4C3E3']);assert.equal(parsed.version,1)
})
test('malformed dimensions use existing positive-size fallbacks',()=>{
 const parsed=validateDesignSpec({...design,floors:[{rooms:[{...room,dimensions:{width:-5,height:'bad',depth:0}}]}]});assert.deepEqual(parsed.floors[0].rooms[0].dimensions,{width:4,height:3,depth:4})
})
test('missing structural object remains invalid rather than fabricating a design',()=>{assert.equal(safeValidateDesignSpec({}).success,false)})
test('brief accepts valid room program and rejects unknown size tier',()=>{
 const brief={style:'Modern',concept:'Quiet',spatialStrategy:'Open',moodBoard:['wood'],keyFeatures:['garden'],roomProgram:[{type:'bedroom',count:2,sizeTier:'medium',adjacentTo:[],floor:0}]};assert.equal(validateArchitectBrief(brief).success,true);assert.equal(validateArchitectBrief({...brief,roomProgram:[{...brief.roomProgram[0],sizeTier:'unbounded'}]}).success,false)
})
test('quiz question retains defaults and discriminant',()=>{assert.deepEqual(validateQuizResponse({type:'question'}),{type:'question',content:'Could you tell me more about your design?',inputType:'free_text',options:[]})})
test('completed quiz applies profile defaults without dropping supplied requirements',()=>{
 const parsed=validateQuizResponse({type:'complete',profile:{householdSize:3,roomRequirements:{bedrooms:2,hasOffice:true}}});assert.equal(parsed.profile.householdSize,3);assert.equal(parsed.profile.roomRequirements.bedrooms,2);assert.equal(parsed.profile.roomRequirements.hasOffice,true);assert.equal(parsed.profile.roomRequirements.bathrooms,1)
})
test('invalid quiz discriminant and missing completion profile fail',()=>{assert.equal(safeValidateQuizResponse({type:'other'}).success,false);assert.equal(safeValidateQuizResponse({type:'complete'}).success,false)})
test('profile budget and room fields use documented schema fallbacks',()=>{const parsed=UserProfileSchema.parse({budget:'invalid',householdSize:'bad'});assert.equal(parsed.budget,'moderate');assert.equal(parsed.householdSize,1);assert.equal(parsed.roomRequirements.bedrooms,1)})
