import React, {FunctionComponent, useEffect, useState} from 'react';
import '@babylonjs/loaders';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import {Texture, RawTexture} from '@babylonjs/core/Materials/Textures';

import {SafeAreaView, View, ViewProps} from 'react-native';

import {EngineView, useEngine} from '@babylonjs/react-native';
import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
import {Camera} from '@babylonjs/core/Cameras/camera';
import {Scene} from '@babylonjs/core/scene';
import {TransformNode} from '@babylonjs/core';
import {Engine} from '@babylonjs/core';
import {Effect} from '@babylonjs/core/Materials/effect';
import {Vector3} from '@babylonjs/core/Maths/math';
import {Color4} from '@babylonjs/core/Maths/math';

const network_weights = {
  'net.0.weight': [
    [
      -0.7847098112106323, -0.49016329646110535, -0.11280905455350876,
      0.0844503864645958, -0.9511948227882385, 1.0189156532287598,
      0.1039632260799408, -0.04665414243936539, 1.10489821434021,
      1.6859174966812134, 1.6694034337997437, -0.06435098499059677,
      0.36381322145462036, -0.14800497889518738, -0.2883828282356262,
      0.04922874644398689, 0.6794434785842896, 1.736321210861206,
      -0.35357534885406494, -0.4056850075721741, -0.20126378536224365,
      0.5541735291481018, -0.7373273372650146, -0.2752824127674103,
      0.05884283781051636, -0.35002729296684265, 0.328484445810318,
      0.06081942841410637, -0.5548740029335022, -1.0637705326080322,
      0.6735913753509521, -0.050898294895887375,
    ],
    [
      0.7855554223060608, 0.45933854579925537, -0.5691769123077393,
      0.2045271247625351, -0.5418243408203125, 0.39460983872413635,
      0.17059099674224854, -0.7311737537384033, -0.12327547371387482,
      -0.355072021484375, 1.041092872619629, 0.3458351194858551,
      -0.09844781458377838, 0.37835216522216797, -0.8415748476982117,
      -0.4523426294326782, -0.9596114754676819, -0.9382393956184387,
      -1.1217836141586304, 0.3008657693862915, -0.8448541164398193,
      -0.1656060665845871, 1.0955487489700317, 0.1235399842262268,
      0.24282310903072357, -0.1482829451560974, 0.4544161856174469,
      -0.363599568605423, 1.1141767501831055, 0.1942155957221985,
      0.23850864171981812, -0.004768510349094868,
    ],
    [
      0.331882506608963, 0.9433267712593079, -0.3670831322669983,
      1.2010431289672852, 0.3545527160167694, -0.08919275552034378,
      1.3185826539993286, -0.15940263867378235, 1.369492530822754,
      -0.4281604588031769, -1.3347543478012085, -0.9577727913856506,
      1.969857096672058, -0.2568703293800354, 1.1752092838287354,
      0.41976243257522583, 0.0361006036400795, -0.22422489523887634,
      -0.060506198555231094, -0.017940141260623932, -0.2977586090564728,
      -0.3996480107307434, 0.12449611723423004, 0.34678223729133606,
      0.1274072229862213, 0.5965556502342224, -0.28780069947242737,
      0.403446763753891, 0.018187223002314568, 0.4360899031162262,
      1.5677225589752197, 0.10768858343362808,
    ],
    [
      0.05948847532272339, -0.5416890382766724, -0.5886391997337341,
      -0.5749231576919556, -1.31155526638031, -2.8738186359405518,
      0.5262534618377686, 0.993732213973999, 0.4674847424030304,
      0.5350334644317627, 0.43073365092277527, -0.07113192975521088,
      0.7998855710029602, 1.022924542427063, 0.5989000797271729,
      -3.1566500663757324, 1.2380585670471191, -2.522834539413452,
      -0.023353777825832367, -0.5545692443847656, -0.22271935641765594,
      0.934395968914032, -0.4988749623298645, 0.5275691151618958,
      -0.15325219929218292, 0.5426939725875854, -1.5486868619918823,
      1.1297457218170166, 1.0134642124176025, 0.5099531412124634,
      -0.18983085453510284, -0.05307935178279877,
    ],
    [
      -0.7740496397018433, -0.24588997662067413, -1.8877317905426025,
      0.44347381591796875, 0.17106014490127563, 0.9144570827484131,
      -2.323637008666992, -0.4963201582431793, -0.4360600709915161,
      0.5534328818321228, -1.0116369724273682, 0.823710560798645,
      -0.6872026920318604, -9.78024673461914, -1.1698838472366333,
      -0.8915276527404785, -0.20386025309562683, -0.9514639973640442,
      -2.2176740169525146, 0.7532898783683777, -2.0880115032196045,
      -0.1965695172548294, 0.8434054851531982, -0.07829349488019943,
      0.04881679266691208, 0.1554076224565506, 0.4914654791355133,
      -1.035446286201477, -0.08698126673698425, -3.0156400203704834,
      0.994506299495697, -0.42493852972984314,
    ],
    [
      -4.619395732879639, -1.3959795236587524, -0.17989295721054077,
      -0.715842068195343, -0.6694802641868591, -1.8510061502456665,
      -0.33639851212501526, 0.10252948105335236, -1.1968022584915161,
      -0.4939103424549103, -0.6676926016807556, 0.6019251346588135,
      0.051139313727617264, 0.00477874930948019, -0.8531123995780945,
      0.37819600105285645, -2.1786770820617676, -0.09307734668254852,
      1.0263733863830566, -0.7334703207015991, 0.5005421042442322,
      -0.30053284764289856, -1.2018300294876099, 0.250632643699646,
      0.7080807685852051, -0.1773671805858612, 0.08611614257097244,
      -0.2295304834842682, -1.3603630065917969, -0.08581335097551346,
      -2.172982931137085, 0.18819263577461243,
    ],
  ],
  'net.1.weight': [
    [1.431880235671997, 1.4679073095321655, 1.8847931623458862],
    [-0.2320955991744995, 0.23686100542545319, 0.7541396617889404],
    [-0.5959000587463379, -0.5469949245452881, -0.18924707174301147],
    [-0.5868023037910461, -0.5476916432380676, -0.7896965146064758],
    [0.3160175085067749, 0.39844855666160583, 0.5640398263931274],
    [1.9806396961212158, 1.8336979150772095, 1.8604174852371216],
    [-0.3479636013507843, 0.09859854727983475, 0.612446665763855],
    [-0.27614620327949524, -0.3459843695163727, -0.28017139434814453],
    [1.7579182386398315, 1.7944544553756714, 2.336411952972412],
    [-0.34559985995292664, -0.1321304440498352, 0.08945634961128235],
    [-0.4613201320171356, -0.5309099555015564, -0.6209595799446106],
    [-0.3834535479545593, -0.5197214484214783, -0.7079983949661255],
    [-0.37280961871147156, -0.4418717622756958, -0.5245701670646667],
    [-1.230979561805725, -1.135473370552063, -0.8604716658592224],
    [0.1635492593050003, 0.4043930768966675, 1.0291893482208252],
    [0.15487223863601685, 0.21928192675113678, 0.2882578670978546],
    [-0.7693074941635132, -0.8962962627410889, -1.5098650455474854],
    [-0.684145450592041, -0.8021600246429443, -0.9800735712051392],
    [-1.072508692741394, -1.0282422304153442, -0.8471440076828003],
    [0.19108039140701294, 0.048128314316272736, -0.17649438977241516],
    [0.9439321160316467, 0.9384105205535889, 0.7494303584098816],
    [0.2336520254611969, 0.20076057314872742, 0.08248840272426605],
    [-0.994490921497345, -1.2539312839508057, -1.7901808023452759],
    [-0.03517208620905876, -0.10259612649679184, -0.4852147102355957],
    [-0.1477234810590744, -0.2701137959957123, -0.3577871024608612],
    [0.004667659755796194, -0.19065608084201813, -0.47647368907928467],
    [-0.347768098115921, -0.09233515709638596, 0.23496799170970917],
    [0.0799797922372818, -0.22432096302509308, -0.5992438793182373],
    [1.0060473680496216, 1.2876454591751099, 1.732854962348938],
    [-0.39587733149528503, -0.5452520847320557, -0.6027585864067078],
    [1.0126928091049194, 0.8485108017921448, 0.9724183082580566],
    [-0.04342234879732132, 0.028723876923322678, -0.06562855839729309],
  ],
  bound: 4,
  cascade: 3,
};

const RenderVertShader = `
in vec3 position;
in vec2 uv;

out vec2 vUv;
out vec3 rayDirection;

uniform mat4 worldViewProjection; // 对应于Three.js中的projectionMatrix * modelViewMatrix
uniform mat4 world; // 对应于Three.js中的modelMatrix
uniform vec3 cameraPosition; // 对应于Three.js中的cameraPosition

void main() {
    vUv = uv;
    gl_Position = worldViewProjection * vec4( position, 1.0 );
    rayDirection = (world * vec4( position, 1.0 )).rgb - cameraPosition;
    mat3 rot = mat3(
        vec3(0.0, -1.0,  0.0), 
		vec3(0.0,  0.0,  1.0),
		vec3(1.0,  0.0,  0.0)
    );
    rayDirection = rot * rayDirection;
}
`;

const RenderFragShader_template = `
				precision highp float;
				// layout(location = 0) out vec4 gl_FragColor;
				
				in vec2 vUv;
				in vec3 rayDirection;

				uniform int mode;

				uniform highp sampler2D tDiffuse;
				uniform highp sampler2D tSpecular;

				uniform highp sampler2D weightsZero;
				uniform highp sampler2D weightsOne;
				
				float inputFetch(vec4 f0, vec3 viewdir, int j) {
				    float input_value = 0.0;
				    if (j < 4) {
				        input_value = (j == 0) ? viewdir.r : ((j == 1) ? viewdir.g : ((j == 2) ? viewdir.b : f0.r));
				    } else {
				        input_value = (j == 4) ? f0.g : ((j == 5) ? f0.b : f0.a);
				    }
				    // if (abs(input_value) < 0.1 / 255.0) {
				    //     input_value = 0.0;
				    // }
				    return input_value;
				}

				highp vec3 evaluateNetwork(vec4 f0, vec3 viewdir) {

				    // NUM_CHANNELS_ZERO (input_dim) is hard-coded as 6
				    // NUM_CHANNELS_ONE (hidden_dim) can vary, but should be divisible by 4
				    // NUM_CHANNELS_TWO (output_dim) is hard-coded as 3

				    highp vec4 v;
				    highp mat4 w;

				    // first layer: 6 --> NUM_CHANNELS_ONE

				    // vec4 result_one[NUM_CHANNELS_ONE / 4];
				    highp vec4 result_1 = vec4(0.0);
				    highp vec4 result_2 = vec4(0.0);
				    highp vec4 result_3 = vec4(0.0);
				    highp vec4 result_4 = vec4(0.0);
				    highp vec4 result_5 = vec4(0.0);
				    highp vec4 result_6 = vec4(0.0);
				    highp vec4 result_7 = vec4(0.0);
				    highp vec4 result_8 = vec4(0.0);

				    v = vec4(
				        inputFetch(f0, viewdir, 0),
				        inputFetch(f0, viewdir, 1),
				        inputFetch(f0, viewdir, 2),
				        inputFetch(f0, viewdir, 3)
				    );
				    // return v.rgb;
				    
				     for (int i = 0; i < 4; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );				        
				        result_1 += v * w;
				    }
				    // return vec3(w[0].r, 0, 0);
				    // return w[0].rgb;
				    // return result_1.rgb;
				    
				 
				    for (int i = 4; i < 8; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
		
				        result_2 += v * w;
				    }
			

				    for (int i = 8; i < 12; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_3 += v * w;
				        // return result_3.rgb;
				    }
			

				    for (int i = 12; i < 16; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_4 += v * w;
				        // return result_4.rgb;
				    }

				    for (int i = 16; i < 20; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_5 += v * w;
				        // return result_5.rgb;
				    }

				    for (int i = 20; i < 24; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_6 += v * w;
				        // return result_6.rgb;
				    }

				    for (int i = 24; i < 28; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_7 += v * w;
				        // return result_7.rgb;
				    }

				    for (int i = 28; i < 32; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, i), 0),
				            texelFetch(weightsZero, ivec2(0, i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_8 += v * w;
				        // return result_8.rgb;
				    }

				    // for (int i = 0; i < NUM_CHANNELS_ONE; i += 4) {
				    //     w = mat4(
				    //         texelFetch(weightsZero, ivec2(0, i), 0),
				    //         texelFetch(weightsZero, ivec2(0, i + 1), 0),
				    //         texelFetch(weightsZero, ivec2(0, i + 2), 0),
				    //         texelFetch(weightsZero, ivec2(0, i + 3), 0)
				    //     );
				    //     result_one[int(i / 4)] += v * w;
				    //     // result_8 += v * w;
				    // }

				    v = vec4(
				        inputFetch(f0, viewdir, 4),
				        inputFetch(f0, viewdir, 5),
				        0.0,
				        0.0
				    );

				    // return v.rgb;

					for (int i = 0; i < 4; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_1 += v * w;
				    }

				    for (int i = 4; i < 8; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_2 += v * w;
				    }

				    for (int i = 8; i < 12; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_3 += v * w;
				    }

				    for (int i = 12; i < 16; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_4 += v * w;
				    }

				    for (int i = 16; i < 20; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_5 += v * w;
				        // return result_5.rgb;
				    }

				    for (int i = 20; i < 24; i += 4) {
				        w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_6 += v * w;
				    }

				    for (int i = 24; i < 28; i += 4) {
				       	w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_7 += v * w;
				    }

				    for (int i = 28; i < 32; i += 4) {
				     	    w = mat4(
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				        );
				        //result_one[i / 4] += v * w;
				        result_8 += v * w;
						// return result_8.rgb;
				    }

				    // for(int i = 0; i < NUM_CHANNELS_ONE; i += 4) {
				    //     w = mat4(
				    //         texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
				    //         texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
				    //         texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
				    //         texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
				    //     );
				    //     result_one[int(i / 4)] += v * w;
				    // }

				    // second layer: NUM_CHANNELS_ONE --> 3
					//  return result_1.rgb;
					// return result_1.rgb + result_2.rgb + result_3.rgb + result_4.rgb + result_5.rgb + result_6.rgb + result_7.rgb + result_8.rgb;

				    highp vec3 result = vec3(0.0);

				    for (int i = 0; i < 8; i++) {
				        vec4 res = vec4(0.0);
				        if(i == 0) { res = result_1; }
				        if(i == 1) { res = result_2;}
				        if(i == 2) { res = result_3; }
				        if(i == 3) { res = result_4; }
				        if(i == 4) { res = result_5; }
				        if(i == 5) { res = result_6; }
				        if(i == 6) { res = result_7; }
				        if(i == 7) { res = result_8; }
				        // v = max(result_one[i], 0.0); // relu
				        v = max(res, 0.0);
				        w = mat4(
				            texelFetch(weightsOne, ivec2(0, i * 3), 0),
				            texelFetch(weightsOne, ivec2(0, i * 3 + 1), 0),
				            texelFetch(weightsOne, ivec2(0, i * 3 + 2), 0),
				            vec4(0.0) // padding
				        );
				        // return vec4(1.0, 0,0,0).rgb;
				        // return (v * w).rgb;
				        result += (v * w).rgb;
				    }
				    // return result;
				    // sigmoid
				    return 1.0 / (1.0 + exp(-result));
				}

				void main() {
				    highp vec4 diffuse = texture( tDiffuse, vUv );
				    if (mode == 1) { // diffuse
						gl_FragColor.rgb = diffuse.rgb;
				    } else {
				          highp vec4 specular = texture( tSpecular, vUv );
				          if (mode == 2) { // specular
				              glFragColor.rgb = evaluateNetwork(specular, normalize(rayDirection));
							// gl_FragColor.rgb = specular.rgb;
				          } else { // full
				             gl_FragColor.rgb = clamp(diffuse.rgb + evaluateNetwork(specular, normalize(rayDirection)), 0.0f, 1.0f);
				         }
				    }

				    gl_FragColor.a = 1.0;
				}
`;

function createViewDependenceFunctions() {
  console.log('shader weights:', network_weights);
  const channelsZero = network_weights['net.0.weight'].length;
  const channelsOne = network_weights['net.1.weight'].length;
  const channelsTwo = network_weights['net.1.weight'][0].length;

  console.log('[INFO] load MLP: ', channelsZero, channelsOne);

  let RenderFragShader = RenderFragShader_template.replace(
    new RegExp('NUM_CHANNELS_ZERO', 'g'),
    String(channelsZero),
  );
  RenderFragShader = RenderFragShader.replace(
    new RegExp('NUM_CHANNELS_ONE', 'g'),
    String(channelsOne),
  );
  RenderFragShader = RenderFragShader.replace(
    new RegExp('NUM_CHANNELS_TWO', 'g'),
    String(channelsTwo),
  );

  return RenderFragShader;
}

function createNetworkWeightTexture(network_weights2, scene) {
  const width = network_weights2.length;
  const height = network_weights2[0].length;

  const weightsData = new Float32Array(width * height);
  for (let co = 0; co < height; co++) {
    for (let ci = 0; ci < width; ci++) {
      const index = co * width + ci; // column-major
      const weight = network_weights2[ci][co];
      weightsData[index] = weight;
    }
  }

  const width_pad = width + (4 - (width % 4)); // make divisible by 4
  const weightsData_pad = new Float32Array(width_pad * height);
  for (let j = 0; j < width_pad; j += 4) {
    for (let i = 0; i < height; i++) {
      for (let c = 0; c < 4; c++) {
        if (c + j >= width) {
          weightsData_pad[j * height + i * 4 + c] = 0.0; // zero padding
        } else {
          weightsData_pad[j * height + i * 4 + c] =
            weightsData[j + i * width + c];
        }
      }
    }
  }

  console.log('weightsData_pad => ', weightsData_pad);

  const texture = new RawTexture(
    weightsData_pad,
    1,
    (width_pad * height) / 4,
    Engine.TEXTUREFORMAT_RGBA,
    scene,
    false,
    true,
    Texture.NEAREST_SAMPLINGMODE,
    Engine.TEXTURETYPE_FLOAT,
  );
  texture.updateSamplingMode(Texture.NEAREST_SAMPLINGMODE);
  texture.updateSamplingMode(Texture.NEAREST_NEAREST);
  texture.update(weightsData_pad);
  return texture;
}

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine()
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();
  const [rootNode, setRootNode] = useState<TransformNode>();

  const BASE =
    'https://app.fanstown.cn/jeecg-boot/designedVideo/models/camera_array/2023-06-16/18500315659/202306161239969494/nerf2mesh/';
  useEffect(() => {
    let isMounted = true;

    if (engine) {
      const scene = new Scene(engine);
      setScene(scene);
      // remove scene background color
      scene.clearColor = new Color4(0, 0, 0, 0);
      scene.createDefaultCamera(true, true, true);
      setCamera(scene.activeCamera!);
      scene.activeCamera!.position = new Vector3(
        -0.2481732007414407,
        0.6419093510466402,
        -2.3858776883602717,
      );
      const rootNode2 = new TransformNode('Root Container', scene);
      setRootNode(rootNode2);

      const transformContainer = new TransformNode(
        'Transform Container',
        scene,
      );
      transformContainer.parent = rootNode2;
      // transformContainer.scaling.scaleInPlace(0.2);
      // transformContainer.position.y -= 0.2;

      for (let cas = 0; cas < 3; cas++) {
        let tDiffuse = new Texture(BASE + '/feat0_' + cas + '.jpg', scene);
        let tSpecular = new Texture(BASE + '/feat1_' + cas + '.jpg', scene);
        let RenderFragShader = createViewDependenceFunctions();
        let weightsZero = createNetworkWeightTexture(
          network_weights['net.0.weight'],
          scene,
        );
        let weightsOne = createNetworkWeightTexture(
          network_weights['net.1.weight'],
          scene,
        );
        Effect.ShadersStore.customVertexShader = RenderVertShader;
        Effect.ShadersStore.customFragmentShader = RenderFragShader;

        const route = {
          vertex: 'custom',
          fragment: 'custom',
        };
        const options = {
          attributes: ['position', 'uv'],
          uniforms: [
            'tDiffuse',
            'tSpecular',
            'mode',
            'weightsZero',
            'weightsOne',

            'worldViewProjection',
            'world',
            'cameraPosition',
          ],
          needAlphaBlending: false,
          needAlphaTesting: false,
        };
        const myShaderMaterial = new ShaderMaterial(
          'myShaderMaterial',
          scene,
          route,
          options,
        );
        myShaderMaterial.setTexture('tDiffuse', tDiffuse);
        myShaderMaterial.setTexture('tSpecular', tSpecular);
        myShaderMaterial.setTexture('weightsZero', weightsZero);
        myShaderMaterial.setTexture('weightsOne', weightsOne);
        myShaderMaterial.setInt('mode', 0);

        SceneLoader.ImportMesh(
          '',
          BASE,
          'mesh_' + cas + '.obj',
          scene,
          newMeshes => {
            const mesh = newMeshes[0];
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(-Math.PI / 2, -Math.PI / 2, 0);
            mesh.scaling.set(1, -1, 1);
            mesh.material = myShaderMaterial;
            mesh.parent = transformContainer;
          },
        );
      }
    }
    // event loop
    engine?.runRenderLoop(() => {
      scene?.render();
    });
  }, [engine, ]);

  return (
    <>
      <View style={props.style}>
        <View style={{flex: 1}}>
          <EngineView camera={camera} displayFrameRate={true} />
        </View>
      </View>
    </>
  );
};

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <EngineScreen style={{flex: 1}} />
      </SafeAreaView>
    </>
  );
};

export default App;
