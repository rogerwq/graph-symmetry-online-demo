import React from 'react';
import {
  canon_smiles,
  smiles_to_atom_vec,
  givp,
  cnap
} from 'graph_symmetry_wasm_binding';
import Molecule from './molecule';
import { Jsme } from 'jsme-react';
import { Button, ToggleButton, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select';
import {
  HorizontalLayout,
  Panel,
  VerticalLayout
} from 'nice-react-layout';

const radios = [
  { name: 'Input SMILES', value: '1' },
  { name: 'Popular Molecules', value: '2' },
  { name: 'Draw Molecule', value: '3' }
];

const popular_molecules = [
  {
    value: 'O=C(C)Oc1ccccc1C(=O)O',
    label:
      'Medicine 1 acetylsalicylic acid (Aspirin) O=C(C)Oc1ccccc1C(=O)O'
  },
  {
    value: 'N1=C(c3c(Sc2c1cccc2)cccc3)N4CCN(CCOCCO)CC4',
    label:
      'Medicine 2 Quetiapine (Lipitor): N1=C(c3c(Sc2c1cccc2)cccc3)N4CCN(CCOCCO)CC4'
  },
  {
    value:
      // 'O=C(O)C[C@H](O)C[C@H](O)CCn2c(c(c(c2c1ccc(F)cc1)c3ccccc3)C(=O)Nc4ccccc4)C(C)C',
      'O=C(O)CC(O)CC(O)CCn2c(c(c(c2c1ccc(F)cc1)c3ccccc3)C(=O)Nc4ccccc4)C(C)C',
    label:
      'Medicine 3 Atorvastatin (Lipitor): O=C(O)C[C@H](O)C[C@H](O)CCn2c(c(c(c2c1ccc(F)cc1)c3ccccc3)C(=O)Nc4ccccc4)C(C)C'
  },
  {
    value: 'CC(=O)Nc1ccc(O)cc1',
    label: 'Medicine 4 Paracetamol (Tylenol): CC(=O)Nc1ccc(O)cc1'
  },
  {
    value: 'C1CC1N1CN2c3nonc3N3CN(C4CC4)CN4c5nonc5N(C1)C2C34',
    label:
      'Symmetric Molecue 1: C1CC1N1CN2c3nonc3N3CN(C4CC4)CN4c5nonc5N(C1)C2C34'
  },
  {
    value:
      'OC(=O)c1cc2Cc3cc(Cc4cc(Cc5cc(Cc(c2)c1)cc(c5)C(O)=O)cc(c4)C(O)=O)cc(c3)C(O)=O',
    label:
      'Symmetric Molecule 2: OC(=O)c1cc2Cc3cc(Cc4cc(Cc5cc(Cc(c2)c1)cc(c5)C(O)=O)cc(c4)C(O)=O)cc(c3)C(O)=O'
  },
  {
    value:
      'C[N+](C)(CCCCCC[N+](C)(C)CCCN1C(=O)C2C3c4ccccc4C(c4ccccc43)C2C1=O)CCCN1C(=O)c2ccccc2C1=O',
    label:
      'Symmetric Molecule 3: C[N+](C)(CCCCCC[N+](C)(C)CCCN1C(=O)C2C3c4ccccc4C(c4ccccc43)C2C1=O)CCCN1C(=O)c2ccccc2C1=O'
  },
  {
    value:
      'OC(c1ccccc1)C1(c2ccccc2)C23c4c5c6c7c8c9c(c%10c%11c2c2c4c4c%12c5c5c6c6c8c8c%13c9c9c%10c%10c%11c%11c2c2c4c4c%12c%12c5c5c6c8c6c8c%13c9c9c%10c%10c%11c2c2c4c4c%12c5c6c5c8c9c%10c2c45)C731',
    label:
      'Symmetric Molecule 4: OC(c1ccccc1)C1(c2ccccc2)C23c4c5c6c7c8c9c(c%10c%11c2c2c4c4c%12c5c5c6c6c8c8c%13c9c9c%10c%10c%11c%11c2c2c4c4c%12c%12c5c5c6c8c6c8c%13c9c9c%10c%10c%11c2c2c4c4c%12c5c6c5c8c9c%10c2c45)C731'
  }
];

const atom_colors = [
  'rgba(0, 255, 0, 0.5)',
  'rgba(0, 255, 255, 0.5)',
  'rgba(0, 0, 255, 0.5)',
  'rgba(255, 0, 255, 0.5)',
  'rgba(255, 255, 0, 0.5)',
  'rgba(255, 0, 0, 0.5)',
  'rgba(128,0,0,0.5)',
  'rgba(199,21,133,0.5)',
  'rgba(75,0,130,0.5)',
  'rgba(50,205,50,0.5)',
  'rgba(0,0,255,0.5)',
  'rgba(124,252,0,0.5)',
  'rgba(60,179,113,0.5)',
  'rgba(255,235,205,0.5)',
  'rgba(0,128,0,0.5)',
  'rgba(85,107,47,0.5)',
  'rgba(147,112,219,0.5)',
  'rgba(224,255,255,0.5)',
  'rgba(173,216,230,0.5)',
  'rgba(240,128,128,0.5)',
  'rgba(255,192,203,0.5)',
  'rgba(72,61,139,0.5)',
  'rgba(255,182,193,0.5)',
  'rgba(250,235,215,0.5)',
  'rgba(127,255,212,0.5)',
  'rgba(0,0,139,0.5)',
  'rgba(210,105,30,0.5)',
  'rgba(102,205,170,0.5)',
  'rgba(210,180,140,0.5)',
  'rgba(255,127,80,0.5)',
  'rgba(135,206,235,0.5)',
  'rgba(0,128,128,0.5)',
  'rgba(144,238,144,0.5)',
  'rgba(244,164,96,0.5)',
  'rgba(0,100,0,0.5)',
  'rgba(255,140,0,0.5)',
  'rgba(255,69,0,0.5)',
  'rgba(128,0,0,0.5)',
  'rgba(72,209,204,0.5)',
  'rgba(245,222,179,0.5)',
  'rgba(165,42,42,0.5)',
  'rgba(218,165,32,0.5)',
  'rgba(221,160,221,0.5)',
  'rgba(128,128,0,0.5)',
  'rgba(255,165,0,0.5)',
  'rgba(153,50,204,0.5)',
  'rgba(0,206,209,0.5)',
  'rgba(255,0,255,0.5)',
  'rgba(47,79,79,0.5)',
  'rgba(250,250,210,0.5)',
  'rgba(139,0,0,0.5)',
  'rgba(255,99,71,0.5)',
  'rgba(135,206,250,0.5)',
  'rgba(255,255,224,0.5)',
  'rgba(0,0,128,0.5)',
  'rgba(100,149,237,0.5)',
  'rgba(0,191,255,0.5)',
  'rgba(0,250,154,0.5)',
  'rgba(0,139,139,0.5)',
  'rgba(95,158,160,0.5)',
  'rgba(238,130,238,0.5)',
  'rgba(205,92,92,0.5)',
  'rgba(255,20,147,0.5)',
  'rgba(255,228,196,0.5)',
  'rgba(128,0,128,0.5)',
  'rgba(218,112,214,0.5)',
  'rgba(127,255,0,0.5)',
  'rgba(138,43,226,0.5)',
  'rgba(160,82,45,0.5)',
  'rgba(255,215,0,0.5)',
  'rgba(255,255,0,0.5)',
  'rgba(255,250,205,0.5)',
  'rgba(65,105,225,0.5)',
  'rgba(238,232,170,0.5)',
  'rgba(152,251,152,0.5)',
  'rgba(250,128,114,0.5)',
  'rgba(245,245,220,0.5)',
  'rgba(0,255,255,0.5)',
  'rgba(0,255,255,0.5)',
  'rgba(30,144,255,0.5)',
  'rgba(143,188,143,0.5)',
  'rgba(32,178,170,0.5)',
  'rgba(205,133,63,0.5)',
  'rgba(0,255,0,0.5)',
  'rgba(188,143,143,0.5)',
  'rgba(176,224,230,0.5)',
  'rgba(0,255,127,0.5)',
  'rgba(148,0,211,0.5)',
  'rgba(139,69,19,0.5)',
  'rgba(175,238,238,0.5)',
  'rgba(233,150,122,0.5)',
  'rgba(216,191,216,0.5)',
  'rgba(0,0,205,0.5)',
  'rgba(139,0,139,0.5)',
  'rgba(222,184,135,0.5)',
  'rgba(46,139,87,0.5)',
  'rgba(240,230,140,0.5)',
  'rgba(189,183,107,0.5)',
  'rgba(220,20,60,0.5)',
  'rgba(178,34,34,0.5)',
  'rgba(123,104,238,0.5)',
  'rgba(219,112,147,0.5)',
  'rgba(107,142,35,0.5)',
  'rgba(255,248,220,0.5)',
  'rgba(173,255,47,0.5)',
  'rgba(255,160,122,0.5)',
  'rgba(255,105,180,0.5)',
  'rgba(25,25,112,0.5)',
  'rgba(34,139,34,0.5)',
  'rgba(70,130,180,0.5)',
  'rgba(106,90,205,0.5)',
  'rgba(184,134,11,0.5)',
  'rgba(255,0,0,0.5)',
  'rgba(64,224,208,0.5)',
  'rgba(186,85,211,0.5)',
  'rgba(154,205,50,0.5)'
];

function create_highlights(orbits) {
  var highlights = {};
  orbits.map((orbit, index) => {
    orbit.map((atom) => {
      highlights[atom] = atom_colors[index];
    });
  });

  return highlights;
}

const App = ({ title }) => {
  let [loading, setLoading] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('1');

  const [smiles, setSmiles] = React.useState('');
  const [csmiles, setCsmiles] = React.useState(
    'Please Input the SMILES...'
  );
  const [numbering, setNumbering] = React.useState([]);
  const [countAtoms, setCountAtoms] = React.useState(0);
  const [givpOrbits, setGivpOrbits] = React.useState([]);
  const [highlightsGivp, setHighlightsGivp] = React.useState({});
  const [cnapOrbits, setCnapOrbits] = React.useState([]);
  const [highlightsCnap, setHighlightsCnap] = React.useState({});

  function update(new_smiles) {
    setSmiles(new_smiles);
    setCsmiles(
      'Waiting for Canonical SMILES or SMILES parsing error ...'
    );
    setLoading(true);
    const cm = canon_smiles(new_smiles);
    setCsmiles('Canonical SMILES:' + cm);
    if (cm !== 'Parsing SMILES error') {
      let avw = smiles_to_atom_vec(new_smiles);
      setCountAtoms(avw.atoms_count());
      setNumbering([...Array(countAtoms).keys()]);
      const sr_givp = givp(avw);
      let givp_orbits = [];
      for (let i = 0; i < sr_givp.orbits_count(); i++) {
        givp_orbits.push(sr_givp.get_orbit(i));
      }
      setHighlightsGivp(create_highlights(givp_orbits));
      setGivpOrbits(givp_orbits);

      const sr_cnap = cnap(avw, sr_givp);
      let cnap_orbits = [];
      for (let i = 0; i < sr_cnap.orbits_count(); i++) {
        cnap_orbits.push(sr_cnap.get_orbit(i));
      }
      setHighlightsCnap(create_highlights(cnap_orbits));
      setCnapOrbits(cnap_orbits);
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>
        This is a demo to show the methods of Symmetry Perception and
        Canonical SMILES for molecules
      </h2>
      <p>
        The details can be found in the paper "A
        Computationally-Realizable Rigorous Canonical Numbering
        Algorithm for Chemical Graphs with its Open-Source
        Implementation in Rust". Welcome to check
        <a href="https://chiral-data.github.io/"> our site</a>!
      </p>
      <div>
        <ButtonGroup size="lg">
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant={'outline-success'}
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      <hr />
      <div>
        <input
          disabled={loading}
          hidden={radioValue !== '1'}
          onChange={(event) => {
            update(event.target.value);
          }}
        />
        <div hidden={radioValue !== '2'}>
          <Select
            disabled={loading}
            options={popular_molecules}
            onChange={(option) => {
              update(option.value);
            }}
          />
        </div>
        <div hidden={radioValue !== '3'}>
          <Jsme
            height="300px"
            width="400px"
            options="oldlook,star"
            disabled={loading}
            onChange={(smiles) => {
              update(smiles);
            }}
          />
        </div>
        <p>SMILES inputted: {smiles}</p>
        <p>{csmiles}</p>
      </div>
      <Button
        onClick={() => {
          numbering.length === 0
            ? setNumbering([...Array(countAtoms).keys()])
            : setNumbering([]);
        }}
      >
        {numbering.length === 0
          ? 'Show Atom Numbers'
          : 'Hide Atom Numbers'}
      </Button>
      <VerticalLayout>
        <HorizontalLayout>
          <Panel>
            <Molecule
              smiles={smiles}
              numbering={numbering}
              highlights={highlightsGivp}
            />
          </Panel>
          <Panel>
            {smiles ? (
              <div>
                <h3>GIVP Orbits</h3>
                {givpOrbits.map((orbit) => (
                  <p>{orbit.toString()}</p>
                ))}
              </div>
            ) : (
              ''
            )}
          </Panel>
        </HorizontalLayout>
        <HorizontalLayout>
          <Panel>
            <Molecule
              smiles={smiles}
              numbering={numbering}
              highlights={highlightsCnap}
            />
          </Panel>
          <Panel>
            {smiles ? (
              <div>
                <h3>CNAP Orbits</h3>
                {cnapOrbits.map((orbit) => (
                  <p>{orbit.toString()}</p>
                ))}
              </div>
            ) : (
              ''
            )}
          </Panel>
        </HorizontalLayout>
      </VerticalLayout>
    </div>
  );
};

export default App;
