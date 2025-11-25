export const StaticMessage = () => {
  return (
    <message>
      <h1>{'Header 1'}</h1>
      <small>{'Subheader'}</small>
      <p>
        <at user={'1234567890'}/>
        {'Hello World!'}
        <br/>
        <code>{'Hello Code!'}</code>
      </p>
      <buttons>
        <primary
          label={'Primary'}
        />
        <secondary
          label={'Secondary'}
        />
      </buttons>
      <users
        placeholder={'Select User'}
      />
    </message>
  );
};

export const StaticMessageJsx = <StaticMessage/>;

export const StaticMessageInlineJsx = (
  <message>
    <h1>{'Header 1'}</h1>
    <small>{'Subheader'}</small>
    <p>
      <at user={'1234567890'}/>
      {'Hello World!'}
      <br/>
      <code>{'Hello Code!'}</code>
    </p>
    <buttons>
      <primary
        label={'Primary'}
      />
      <secondary
        label={'Secondary'}
      />
    </buttons>
    <users
      placeholder={'Select User'}
    />
  </message>
);

export const StaticModalInlineJsx = (
  <modal
    title={'Hello World!'}
  >
    <label
      label={'Selector 1'}
    >
      <select
        placeholder={'Select String'}
      />
    </label>
    <label
      label={'Selector 2'}
    >
      <roles
        placeholder={'Select Role'}
      />
    </label>
  </modal>
);
