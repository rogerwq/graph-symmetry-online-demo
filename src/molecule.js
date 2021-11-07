import React from 'react';
import SmilesDrawer from 'smiles-drawer-fork-continue';

export default class Molecule extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  updateDrawer() {
    let options = { width: 500, height: 500 };
    const { theme } = this.props;
    SmilesDrawer.apply(
      options,
      'canvas[data-smiles]',
      theme ? theme : 'light'
    );
  }

  componentDidUpdate() {
    this.updateDrawer();
  }

  componentDidMount() {
    this.updateDrawer();
  }

  render() {
    const {
      smiles,
      numbering,
      numbering_directions,
      highlights
    } = this.props;
    return (
      <div>
        <canvas
          id="example-canvas"
          data-smiles={smiles}
          data-numbering={JSON.stringify(numbering)}
          data-numbering-directions={JSON.stringify(
            numbering_directions
          )}
          data-vertex-highlights={JSON.stringify(highlights)}
        ></canvas>
      </div>
    );
  }
}
