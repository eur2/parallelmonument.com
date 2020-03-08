import React from 'react';

export default class Modal extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  render() {
    const { title, content } = this.props;
    const { open } = this.state;
    return (
      <>
        <button onClick={this.handleClick}>{open ? title : title}</button>
        {open ? (
          <div className={open ? 'modal-open' : 'modal-close'}>
            <div>
              <button className="close" onClick={this.handleClick}>
                ×
              </button>
            </div>
            {content}
          </div>
        ) : null}
      </>
    );
  }
}
