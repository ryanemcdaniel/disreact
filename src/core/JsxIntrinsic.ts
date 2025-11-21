import * as S from 'effect/Schema';
import * as v10 from 'discord-api-types/v10';
import {hole} from 'effect/Function';
import type * as Jsx from './Jsx.js';
import type * as Types from 'effect/Types';

const encodeHex = (hex: string | number): number =>
  typeof hex === 'number' ? hex :
  hex.startsWith('#') ? parseInt(hex.slice(1), 16) :
  parseInt(hex, 16);

const HexColor = S.transform(
  S.Number,
  S.Union(
    S.String.pipe(
      S.maxLength(8),
      S.pattern(/(#|0x)([0-9]|[a-f]|[A-F])+/g),
    ),
    S.Int.pipe(S.between(0, 0xFFFFFF)),
  ),
  {
    decode: hole,
    encode: encodeHex,
  },
);

const Snowflake = S.compose(
  S.String,
  S.Union(S.String, S.BigInt),
);

const MenuChannelTypes  = S.Enums(v10.ChannelType);
const MenuMinValues     = S.Int.pipe(S.between(0, 25));
const MenuMaxValues     = S.Int.pipe(S.between(1, 25));
const Uint32Id          = S.Int.pipe(S.between(1, 0xFFFFFFFF));
const MenuPlaceholder   = S.String.pipe(S.maxLength(150));
const CustomId          = S.String.pipe(S.maxLength(100));
const ButtonUrl         = S.compose(S.String.pipe(S.maxLength(512)), S.Union(S.String, S.URL));
const OptionValue       = S.String.pipe(S.maxLength(100));
const OptionLabel       = S.String.pipe(S.maxLength(100));
const OptionDescription = S.String.pipe(S.maxLength(100));

// todo
const Handler = S.declare((u): u is () => {} => typeof u === 'function');

const Emoji = S.Struct({
  id      : S.optional(S.String),
  name    : S.optional(S.String),
  animated: S.optional(S.Boolean),
});

const MarkdownAnchorProps = S.Struct({
  href    : S.String,
  embed   : S.optional(S.Boolean),
  children: S.optional(S.Any),
});

const MarkdownMentionProps = S.Union(
  S.Struct({here: S.Boolean}),
  S.Struct({everyone: S.Boolean}),
  S.Struct({user: S.String}),
  S.Struct({role: S.String}),
  S.Struct({channel: S.String}),
);

const MarkdownTimestampProps = S.Union(
  S.Struct({t: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({T: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({d: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({D: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({f: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({F: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({s: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({S: S.Union(S.String, S.DateTimeUtc)}),
  S.Struct({R: S.Union(S.String, S.DateTimeUtc)}),
);

const MarkdownProps = S.Struct({
  children: S.optional(S.Any),
});

const MarkdownCodeBlockProps = S.Struct({
  lang    : S.optional(S.String),
  children: S.String,
});

const MarkdownHeadingProps = S.Struct({
  children: S.optional(S.Any),
});

const MarkdownListingProps = S.Struct({
  indent  : S.optional(S.Int.pipe(S.positive())),
  children: S.optional(S.Any),
});

const EmbedProps = S.Struct({
  title    : S.optional(S.String.pipe(S.maxLength(256))),
  color    : S.optional(HexColor),
  timestamp: S.optional(S.Union(S.String, S.DateTimeUtc)),
  children : S.optional(S.Any),
});

const EmbedAuthorProps = S.Struct({
  name: S.String.pipe(S.maxLength(256)),
  url : S.optional(S.String),
});

const EmbedFooterProps = S.Struct({
  text    : S.required(S.String.pipe(S.maxLength(2048))),
  children: S.optional(S.Any),
});

const EmbedFieldProps = S.Struct({
  name  : S.String.pipe(S.maxLength(256)),
  value : S.String.pipe(S.maxLength(1024)),
  inline: S.optional(S.Boolean),
});

const ButtonPrimaryProps = S.Union(
  S.Struct({
    id       : S.optional(Uint32Id),
    custom_id: S.optional(S.String),
    label    : S.required(S.String),
    disabled : S.optional(S.Boolean),
    onClick  : S.optional(Handler),
  }),
  S.Struct({
    id       : S.optional(Uint32Id),
    custom_id: S.optional(S.String),
    emoji    : S.required(Emoji),
    disabled : S.optional(S.Boolean),
    onClick  : S.optional(Handler),
  }),
  S.Struct({
    id       : S.optional(Uint32Id),
    custom_id: S.optional(S.String),
    label    : S.required(S.String),
    emoji    : S.required(Emoji),
    disabled : S.optional(S.Boolean),
    onClick  : S.optional(Handler),
  }),
);

const ButtonSecondaryProps = ButtonPrimaryProps;

const ButtonSuccessProps = ButtonPrimaryProps;

const ButtonDangerProps = ButtonPrimaryProps;

const ButtonLinkProps = S.Union(
  S.Struct({
    id      : S.optional(Uint32Id),
    url     : S.required(ButtonUrl),
    label   : S.required(S.String),
    disabled: S.optional(S.Boolean),
  }),
  S.Struct({
    id      : S.optional(Uint32Id),
    url     : S.required(ButtonUrl),
    emoji   : S.required(S.String),
    disabled: S.optional(S.Boolean),
  }),
  S.Struct({
    id      : S.optional(Uint32Id),
    url     : S.required(ButtonUrl),
    label   : S.required(S.String),
    emoji   : S.required(S.String),
    disabled: S.optional(S.Boolean),
  }),
);

const ButtonPremiumProps = S.Struct({
  id      : S.optional(Uint32Id),
  sku     : S.String,
  disabled: S.optional(S.Boolean),
});

const ButtonRowProps = S.Struct({
  id      : S.optional(Uint32Id),
  children: S.Union(S.Array(S.Any), S.Any),
});

const MenuOptionProps = S.Struct({
  value      : S.required(OptionValue),
  label      : S.required(OptionLabel),
  description: S.optional(OptionDescription),
  emoji      : S.optional(Emoji),
  default    : S.optional(S.Boolean),
});

const MenuStringProps = S.Struct({
  id         : S.optional(Uint32Id),
  custom_id  : S.optional(CustomId),
  placeholder: S.optional(MenuPlaceholder),
  min_values : S.optional(MenuMinValues),
  max_values : S.optional(MenuMaxValues),
  required   : S.optional(S.Boolean),
  disabled   : S.optional(S.Boolean),
  onSelect   : S.optional(Handler),
  children   : S.optional(S.Any),
});

const MenuValueProps = S.Union(
  S.Struct({user: Snowflake}),
  S.Struct({role: Snowflake}),
  S.Struct({channel: Snowflake}),
);

const MenuUsersProps = S.Struct({
  id         : S.optional(Uint32Id),
  custom_id  : S.optional(CustomId),
  placeholder: S.optional(MenuPlaceholder),
  min_values : S.optional(MenuMinValues),
  max_values : S.optional(MenuMaxValues),
  required   : S.optional(S.Boolean),
  disabled   : S.optional(S.Boolean),
  onSelect   : S.optional(Handler),
  children   : S.optional(S.Any),
});

const MenuRolesProps = S.Struct({
  id         : S.optional(Uint32Id),
  custom_id  : S.optional(CustomId),
  placeholder: S.optional(MenuPlaceholder),
  min_values : S.optional(MenuMinValues),
  max_values : S.optional(MenuMaxValues),
  required   : S.optional(S.Boolean),
  disabled   : S.optional(S.Boolean),
  onSelect   : S.optional(Handler),
  children   : S.optional(S.Any),
});

const MenuChannelsProps = S.Struct({
  id           : S.optional(Uint32Id),
  custom_id    : S.optional(CustomId),
  placeholder  : S.optional(MenuPlaceholder),
  min_values   : S.optional(MenuMinValues),
  max_values   : S.optional(MenuMaxValues),
  required     : S.optional(S.Boolean),
  disabled     : S.optional(S.Boolean),
  channel_types: S.optional(S.Array(MenuChannelTypes)),
  onSelect     : S.optional(Handler),
  children     : S.optional(S.Any),
});

const MenuMentionsProps = S.Struct({
  id         : S.optional(Uint32Id),
  custom_id  : S.optional(CustomId),
  placeholder: S.optional(MenuPlaceholder),
  min_values : S.optional(MenuMinValues),
  max_values : S.optional(MenuMaxValues),
  required   : S.optional(S.Boolean),
  disabled   : S.optional(S.Boolean),
  onSelect   : S.optional(Handler),
  children   : S.optional(S.Any),
});

const LayoutSeparatorProps = S.Struct({
  id     : S.optional(Uint32Id),
  divider: S.optional(S.Boolean),
  spacing: S.optional(S.Literal(1, 2)),
});

const LayoutSectionProps = S.Struct({
  id      : S.optional(Uint32Id),
  children: S.optional(S.Any),
});

const LayoutContainerProps = S.Struct({
  id      : S.optional(Uint32Id),
  color   : S.optional(HexColor),
  spoiler : S.optional(S.Boolean),
  children: S.optional(S.Any),
});

const LayoutMediaGalleryProps = S.Struct({
  id      : S.optional(Uint32Id),
  children: S.optional(S.Any),
});

const LayoutFileProps = S.Struct({
  id     : S.optional(Uint32Id),
  spoiler: S.optional(S.Boolean),
  file   : S.optional(S.Any),
});

const LayoutThumbnailProps = S.Struct({
  id         : S.optional(Uint32Id),
  description: S.optional(S.String.pipe(S.maxLength(1024))),
  spoiler    : S.optional(S.Boolean),
  children   : S.optional(S.Any),
});

const LayoutTextDisplayProps = S.Struct({
  id      : S.optional(Uint32Id),
  children: S.optional(S.Any),
});

const MessageProps = S.Struct({
  flags   : S.optional(S.Any),
  children: S.optional(S.Any),
});

const EphemeralProps = S.Struct({
  flags   : S.optional(S.Any),
  children: S.optional(S.Any),
});

const ModalLabelProps = S.Struct({
  id         : S.optional(Uint32Id),
  label      : S.String.pipe(S.maxLength(45)),
  description: S.optional(S.String.pipe(S.maxLength(100))),
  children   : S.optional(S.Any),
});

const ModalFileUploadProps = S.Struct({
  id       : S.optional(Uint32Id),
  custom_id: S.optional(CustomId),
  min      : S.optional(S.Int.pipe(S.between(0, 10))),
  max      : S.optional(S.Int.pipe(S.between(1, 10))),
  required : S.optional(S.Boolean),
});

const ModalTextInputProps = S.Struct({
  id         : S.optional(Uint32Id),
  custom_id  : S.optional(CustomId),
  long       : S.optional(S.Boolean),
  placeholder: S.optional(S.String.pipe(S.maxLength(100))),
  value      : S.optional(S.String.pipe(S.maxLength(4000))),
  min        : S.optional(S.Int.pipe(S.between(0, 4000))),
  max        : S.optional(S.Int.pipe(S.between(1, 4000))),
  required   : S.optional(S.Boolean),
});

const ModalProps = S.Struct({
  custom_id: S.optional(S.String),
  title    : S.String,
  onSubmit : S.optional(Handler),
  children : S.optional(S.Any),
});

const a          = 'a' as const;
const at         = 'at' as const;
const time       = 'time' as const;
const b          = 'b' as const;
const i          = 'i' as const;
const s          = 's' as const;
const u          = 'u' as const;
const code       = 'code' as const;
const details    = 'details' as const;
const br         = 'br' as const;
const p          = 'p' as const;
const blockquote = 'blockquote' as const;
const pre        = 'pre' as const;
const h1         = 'h1' as const;
const h2         = 'h2' as const;
const h3         = 'h3' as const;
const small      = 'small' as const;
const ol         = 'ol' as const;
const ul         = 'ul' as const;
const li         = 'li' as const;
const embed      = 'embed' as const;
const author     = 'author' as const;
const field      = 'field' as const;
const footer     = 'footer' as const;
const buttons    = 'buttons' as const;
const primary    = 'primary' as const;
const secondary  = 'secondary' as const;
const success    = 'success' as const;
const danger     = 'danger' as const;
const link       = 'link' as const;
const premium    = 'premium' as const;
const select     = 'select' as const;
const option     = 'option' as const;
const users      = 'users' as const;
const roles      = 'roles' as const;
const channels   = 'channels' as const;
const mentions   = 'mentions' as const;
const value      = 'value' as const;
const separator  = 'separator' as const;
const section    = 'section' as const;
const container  = 'container' as const;
const gallery    = 'gallery' as const;
const display    = 'display' as const;
const thumbnail  = 'thumbnail' as const;
const file       = 'file' as const;
const message    = 'message' as const;
const ephemeral  = 'ephemeral' as const;
const label      = 'label' as const;
const textarea   = 'textarea' as const;
const upload     = 'upload' as const;
const modal      = 'modal' as const;

const MARKDOWN = [a, at, time, b, i, s, u, code, details, br, p, blockquote, pre, h1, h2, h3, small, ol, ul, li] as const;
const BUTTONS  = [primary, secondary, success, danger, link, premium] as const;
const MENUS    = [select, users, roles, channels, mentions] as const;
const LAYOUT   = [separator, section, container, gallery, display, thumbnail, file] as const;
const MESSAGE  = [buttons, ...MENUS, ...LAYOUT, ...MARKDOWN];

const Targets = {
  [a]         : S.String,
  [at]        : S.String,
  [time]      : S.String,
  [b]         : S.String,
  [i]         : S.String,
  [s]         : S.String,
  [u]         : S.String,
  [code]      : S.String,
  [details]   : S.String,
  [br]        : S.String,
  [p]         : S.String,
  [blockquote]: S.String,
  [pre]       : S.String,
  [h1]        : S.String,
  [h2]        : S.String,
  [h3]        : S.String,
  [small]     : S.String,
  [ol]        : S.Array(S.String),
  [ul]        : S.Array(S.String),
  [li]        : S.String,
  [embed]     : S.Any as S.Schema<v10.APIEmbed>,
  [author]    : S.Any as S.Schema<v10.APIEmbedAuthor>,
  [field]     : S.Any as S.Schema<v10.APIEmbedField>,
  [footer]    : S.Any as S.Schema<v10.APIEmbedFooter>,
  [buttons]   : S.Any as S.Schema<v10.APIActionRowComponent<v10.APIButtonComponent>>,
  [primary]   : S.Any as S.Schema<v10.APIButtonComponentWithCustomId>,
  [secondary] : S.Any as S.Schema<v10.APIButtonComponentWithCustomId>,
  [success]   : S.Any as S.Schema<v10.APIButtonComponentWithCustomId>,
  [danger]    : S.Any as S.Schema<v10.APIButtonComponentWithCustomId>,
  [link]      : S.Any as S.Schema<v10.APIButtonComponentWithURL>,
  [premium]   : S.Any as S.Schema<v10.APIButtonComponentWithSKUId>,
  [select]    : S.Any as S.Schema<v10.APIStringSelectComponent>,
  [option]    : S.Any as S.Schema<v10.APISelectMenuOption>,
  [users]     : S.Any as S.Schema<v10.APIUserSelectComponent>,
  [roles]     : S.Any as S.Schema<v10.APIRoleSelectComponent>,
  [channels]  : S.Any as S.Schema<v10.APIChannelSelectComponent>,
  [mentions]  : S.Any as S.Schema<v10.APIMentionableSelectComponent>,
  [value]     : S.Any as S.Schema<v10.APISelectMenuDefaultValue<v10.SelectMenuDefaultValueType>>,
  [separator] : S.Any as S.Schema<v10.APISeparatorComponent>,
  [section]   : S.Any as S.Schema<v10.APISectionComponent>,
  [container] : S.Any as S.Schema<v10.APIContainerComponent>,
  [gallery]   : S.Any as S.Schema<v10.APIMediaGalleryComponent>,
  [display]   : S.Any as S.Schema<v10.APITextDisplayComponent>,
  [thumbnail] : S.Any as S.Schema<v10.APIThumbnailComponent>,
  [file]      : S.Any as S.Schema<v10.APIFileComponent>,
  [message]   : S.Any as S.Schema<v10.APIInteractionResponseCallbackData>,
  [ephemeral] : S.Any as S.Schema<v10.APIInteractionResponseCallbackData>,
  [label]     : S.Any as S.Schema<v10.APILabelComponent>,
  [textarea]  : S.Any as S.Schema<v10.APITextInputComponent>,
  [upload]    : S.Any as S.Schema<v10.APIFileUploadComponent>,
  [modal]     : S.Any as S.Schema<v10.APIModalInteractionResponseCallbackData>,
} as const;

const Attributes = {
  [a]         : MarkdownAnchorProps,
  [at]        : MarkdownMentionProps,
  [time]      : MarkdownTimestampProps,
  [b]         : MarkdownProps,
  [i]         : MarkdownProps,
  [s]         : MarkdownProps,
  [u]         : MarkdownProps,
  [code]      : MarkdownProps,
  [details]   : MarkdownProps,
  [br]        : MarkdownProps,
  [p]         : MarkdownProps,
  [blockquote]: MarkdownProps,
  [pre]       : MarkdownCodeBlockProps,
  [h1]        : MarkdownHeadingProps,
  [h2]        : MarkdownHeadingProps,
  [h3]        : MarkdownHeadingProps,
  [small]     : MarkdownHeadingProps,
  [ol]        : MarkdownListingProps,
  [ul]        : MarkdownListingProps,
  [li]        : MarkdownListingProps,
  [embed]     : EmbedProps,
  [author]    : EmbedAuthorProps,
  [field]     : EmbedFieldProps,
  [footer]    : EmbedFooterProps,
  [buttons]   : ButtonRowProps,
  [primary]   : ButtonPrimaryProps,
  [secondary] : ButtonSecondaryProps,
  [success]   : ButtonSuccessProps,
  [danger]    : ButtonDangerProps,
  [link]      : ButtonLinkProps,
  [premium]   : ButtonPremiumProps,
  [select]    : MenuStringProps,
  [option]    : MenuOptionProps,
  [users]     : MenuUsersProps,
  [roles]     : MenuRolesProps,
  [channels]  : MenuChannelsProps,
  [mentions]  : MenuMentionsProps,
  [value]     : MenuValueProps,
  [separator] : LayoutSeparatorProps,
  [section]   : LayoutSectionProps,
  [container] : LayoutContainerProps,
  [gallery]   : LayoutMediaGalleryProps,
  [display]   : LayoutTextDisplayProps,
  [thumbnail] : LayoutThumbnailProps,
  [file]      : LayoutFileProps,
  [message]   : MessageProps,
  [ephemeral] : EphemeralProps,
  [label]     : ModalLabelProps,
  [textarea]  : ModalTextInputProps,
  [upload]    : ModalFileUploadProps,
  [modal]     : ModalProps,
} as const;

const Values = {
  [a]         : S.String,
  [at]        : S.String,
  [time]      : S.String,
  [b]         : S.String,
  [i]         : S.String,
  [s]         : S.String,
  [u]         : S.String,
  [code]      : S.String,
  [details]   : S.String,
  [br]        : S.String,
  [p]         : S.String,
  [blockquote]: S.String,
  [pre]       : S.String,
  [h1]        : S.String,
  [h2]        : S.String,
  [h3]        : S.String,
  [small]     : S.String,
  [ol]        : S.String,
  [ul]        : S.String,
  [li]        : S.String,
  [embed]     : S.Never,
  [author]    : S.Never,
  [field]     : S.Never,
  [footer]    : S.Never,
  [buttons]   : S.Never,
  [primary]   : S.Never,
  [secondary] : S.Never,
  [success]   : S.Never,
  [danger]    : S.Never,
  [link]      : S.Never,
  [premium]   : S.Never,
  [select]    : S.Never,
  [option]    : S.Never,
  [users]     : S.Never,
  [roles]     : S.Never,
  [channels]  : S.Never,
  [mentions]  : S.Never,
  [value]     : S.Never,
  [separator] : S.Never,
  [section]   : S.Never,
  [container] : S.Never,
  [gallery]   : S.Never,
  [display]   : S.Never,
  [thumbnail] : S.Never,
  [file]      : S.Never,
  [message]   : S.Never,
  [ephemeral] : S.Never,
  [label]     : S.Never,
  [textarea]  : S.Never,
  [upload]    : S.Never,
  [modal]     : S.Never,
} as const;

const Children = {
  [a]         : MARKDOWN,
  [at]        : MARKDOWN,
  [time]      : MARKDOWN,
  [b]         : MARKDOWN,
  [i]         : MARKDOWN,
  [s]         : MARKDOWN,
  [u]         : MARKDOWN,
  [code]      : MARKDOWN,
  [details]   : MARKDOWN,
  [br]        : MARKDOWN,
  [p]         : MARKDOWN,
  [blockquote]: MARKDOWN,
  [pre]       : MARKDOWN,
  [h1]        : MARKDOWN,
  [h2]        : MARKDOWN,
  [h3]        : MARKDOWN,
  [small]     : MARKDOWN,
  [ol]        : MARKDOWN,
  [ul]        : MARKDOWN,
  [li]        : MARKDOWN,
  [embed]     : [author, field, footer, ...MARKDOWN],
  [author]    : [],
  [field]     : [],
  [footer]    : [],
  [buttons]   : BUTTONS,
  [primary]   : [],
  [secondary] : [],
  [success]   : [],
  [danger]    : [],
  [link]      : [],
  [premium]   : [],
  [select]    : [option],
  [option]    : [value],
  [users]     : [value],
  [roles]     : [value],
  [channels]  : [value],
  [mentions]  : [value],
  [value]     : [],
  [separator] : [],
  [section]   : [display, ...BUTTONS],
  [container] : [separator, section, gallery, display, thumbnail, file, buttons, ...MENUS],
  [gallery]   : [],
  [display]   : MARKDOWN,
  [thumbnail] : [],
  [file]      : [],
  [message]   : MESSAGE,
  [ephemeral] : MESSAGE,
  [label]     : [textarea, upload, ...MENUS],
  [textarea]  : [],
  [upload]    : [],
  [modal]     : [label],
} as const;

type Tags = keyof typeof Targets;
type Targets = typeof Targets;
type Attributes = typeof Attributes;
type Values = typeof Values;
type Children = typeof Children;
type Self<T extends Tags> = Jsx.Fold.Node<
  T,
  Attributes[T]['Type'],
  Values[T]['Type'] extends never ? never : Jsx.Fold.Value<Values[T]['Type']>,
  { [K in Children[T][number]]: Jsx.Fold<K, Targets[K]['Type']> }[Children[T][number]]
>;
type Transform<K extends Tags> = (source: Self<K>, tgt: Targets[K]['Type']) => Targets[K]['Type'];

export type Folds = Types.Simplify<{ [K in Tags]: Jsx.Fold<K, Targets[K]['Type']> }[Tags]>;

const transforms: { [K in Tags]: Transform<K> } = {
  [a](src) {
    return '';
  },
  [at](src) {
    return '';
  },
  [time](src) {
    return '';
  },
  [b](src) {
    return `**${src.props}**`;
  },
  [i](src) {
    return `*${src.props}*`;
  },
  [s](src) {
    return `~~${src.props}~~`;
  },
  [u](src) {
    return `__${src.props}__`;
  },
  [code](src) {
    return `\`${src.props}\``;
  },
  [details](src) {
    return `||${src.props}||`;
  },
  [br](src) {
    return '\n';
  },
  [p](src) {
    return '';
  },
  [blockquote](src) {
    return `> ${src.props}`;
  },
  [pre](src) {
    return `\`\`\`${src.props.lang ?? ''}${src.props}\`\`\``;
  },
  [h1](src) {
    return `# ${src.props}`;
  },
  [h2](src) {
    return `## ${src.props}`;
  },
  [h3](src) {
    return `### ${src.props}`;
  },
  [small](src) {
    return `-# ${src.props}`;
  },
  [ol](src) {
    return [];
  },
  [ul](src) {
    return [];
  },
  [li](src) {
    return '';
  },
  [embed](src, tgt) {
    tgt.title       = src.props.title as any;
    tgt.description = '';
    tgt.color       = Number(src.props.color ?? 0);
    tgt.timestamp   = src.props.timestamp as any;
    tgt.fields      = [];
    for (const child of src.children) {
      switch (child.type) {
        case author:
          tgt.author = child.data;
          break;
        case field:
          tgt.fields.push(child.data);
          break;
        case footer:
          tgt.footer = child.data;
          break;
      }
    }
    return tgt;
  },
  [author](src, tgt) {
    tgt.name = src.props.name;
    return tgt;
  },
  [field](src, tgt) {
    tgt.name   = src.props.name;
    tgt.value  = src.props.value;
    tgt.inline = src.props.inline ?? false;
    return tgt;
  },
  [footer](src, tgt) {
    tgt.text = src.props.text;
    return tgt;
  },
  [buttons](src, tgt) {
    tgt.id         = src.props.id ?? 0;
    tgt.type       = 1;
    tgt.components = src.children.map((c) => c.data);
    return tgt;
  },
  [primary](src, tgt) {
    tgt.id        = src.props.id ?? 0;
    tgt.type      = 2;
    tgt.style     = 1;
    tgt.custom_id = src.props.custom_id ?? src.step;
    if ('label' in src.props) tgt.label = src.props.label;
    if ('emoji' in src.props) tgt.emoji = src.props.emoji as any;
    tgt.disabled = src.props.disabled ?? false;
    return tgt;
  },
  [secondary](src, tgt) {
    tgt.id        = src.props.id ?? 0;
    tgt.type      = 2;
    tgt.style     = 2;
    tgt.custom_id = src.props.custom_id ?? src.step;
    tgt.disabled  = src.props.disabled ?? false;
    if ('label' in src.props) tgt.label = src.props.label;
    if ('emoji' in src.props) tgt.emoji = src.props.emoji as any;
    return tgt;
  },
  [success](src, tgt) {
    tgt.id        = src.props.id ?? 0;
    tgt.type      = 2;
    tgt.style     = 3;
    tgt.custom_id = src.props.custom_id ?? src.step;
    tgt.disabled  = src.props.disabled ?? false;
    if ('label' in src.props) tgt.label = src.props.label;
    if ('emoji' in src.props) tgt.emoji = src.props.emoji as any;
    return tgt;
  },
  [danger](src, tgt) {
    tgt.id        = src.props.id ?? 0;
    tgt.type      = 2;
    tgt.style     = 4;
    tgt.custom_id = src.props.custom_id ?? src.step;
    tgt.disabled  = src.props.disabled ?? false;
    if ('label' in src.props) tgt.label = src.props.label;
    if ('emoji' in src.props) tgt.emoji = src.props.emoji as any;
    return tgt;
  },
  [link](src, tgt) {
    tgt.id       = src.props.id ?? 0;
    tgt.type     = 2;
    tgt.style    = 5;
    tgt.url      = src.props.url as any;
    tgt.disabled = src.props.disabled ?? false;
    if ('label' in src.props) tgt.label = src.props.label;
    if ('emoji' in src.props) tgt.emoji = src.props.emoji as any;
    return tgt;
  },
  [premium](src, tgt) {
    tgt.id       = src.props.id ?? 0;
    tgt.type     = 2;
    tgt.style    = 6;
    tgt.sku_id   = src.props.sku;
    tgt.disabled = src.props.disabled ?? false;
    return tgt;
  },
  [select](src, tgt) {
    tgt.id          = src.props.id ?? 0;
    tgt.type        = 3;
    tgt.custom_id   = src.props.custom_id ?? src.step;
    tgt.placeholder = src.props.placeholder as any;
    tgt.min_values  = src.props.min_values ?? 1;
    tgt.max_values  = src.props.max_values ?? 1;
    tgt.disabled    = src.props.disabled ?? false;
    tgt.required    = src.props.required ?? false;
    return tgt;
  },
  [option](src, tgt) {
    return tgt;
  },
  [users](src, tgt) {
    tgt.id          = src.props.id ?? 0;
    tgt.type        = 5;
    tgt.custom_id   = src.props.custom_id ?? src.step;
    tgt.placeholder = src.props.placeholder as any;
    tgt.min_values  = src.props.min_values ?? 1;
    tgt.max_values  = src.props.max_values ?? 1;
    tgt.disabled    = src.props.disabled ?? false;
    tgt.required    = src.props.required ?? false;
    return tgt;
  },
  [roles](src, tgt) {
    tgt.id          = src.props.id ?? 0;
    tgt.type        = 6;
    tgt.custom_id   = src.props.custom_id ?? src.step;
    tgt.placeholder = src.props.placeholder as any;
    tgt.min_values  = src.props.min_values ?? 1;
    tgt.max_values  = src.props.max_values ?? 1;
    tgt.disabled    = src.props.disabled ?? false;
    tgt.required    = src.props.required ?? false;
    return tgt;
  },
  [channels](src, tgt) {
    tgt.id            = src.props.id ?? 0;
    tgt.type          = 8;
    tgt.custom_id     = src.props.custom_id ?? src.step;
    tgt.placeholder   = src.props.placeholder as any;
    tgt.min_values    = src.props.min_values ?? 1;
    tgt.max_values    = src.props.max_values ?? 1;
    tgt.disabled      = src.props.disabled ?? false;
    tgt.required      = src.props.required ?? false;
    tgt.channel_types = (src.props.channel_types ?? []) as v10.ChannelType[];
    return tgt;
  },
  [mentions](src, tgt) {
    tgt.id   = src.props.id ?? 0;
    tgt.type = 7;
    return tgt;
  },
  [value](src, tgt) {
    if ('user' in src.props) {
      tgt.type = 'user' as any;
      tgt.id   = String(src.props.user);
    }
    else if ('role' in src.props) {
      tgt.type = 'role' as any;
      tgt.id   = String(src.props.role);
    }
    else if ('channel' in src.props) {
      tgt.type = 'channel' as any;
      tgt.id   = String(src.props.channel);
    }
    return tgt;
  },
  [separator](src, tgt) {
    tgt.id      = src.props.id ?? 0;
    tgt.type    = 14;
    tgt.divider = src.props.divider ?? false;
    tgt.spacing = src.props.spacing ?? 1;
    return tgt;
  },
  [section](src, tgt) {
    tgt.id         = src.props.id ?? 0;
    tgt.type       = 9;
    tgt.components = [];
    for (const child of src.children) {
      if (child.type === 'display') {
        tgt.components.push(child.data);
      }
      else {
        tgt.accessory = child.data;
      }
    }
    return tgt;
  },
  [container](src, tgt) {
    tgt.id           = src.props.id ?? 0;
    tgt.type         = 17;
    tgt.spoiler      = src.props.spoiler ?? false;
    tgt.accent_color = Number(src.props.color ?? 0);
    tgt.components   = []; // todo
    return tgt;
  },
  [gallery](src, tgt) {
    tgt.id    = src.props.id ?? 0;
    tgt.type  = 12;
    tgt.items = []; // todo
    return tgt;
  },
  [display](src, tgt) {
    tgt.id      = src.props.id ?? 0;
    tgt.type    = 10;
    tgt.content = ''; // todo
    return tgt;
  },
  [thumbnail](src, tgt) {
    tgt.id          = src.props.id ?? 0;
    tgt.type        = 11;
    tgt.description = src.props.description as any;
    tgt.spoiler     = src.props.spoiler ?? false;
    return tgt;
  },
  [file](src, tgt) {
    tgt.id      = src.props.id ?? 0;
    tgt.type    = 13;
    tgt.spoiler = src.props.spoiler ?? false;
    return tgt;
  },
  [message](src, tgt) {
    tgt.flags = src.props.flags ?? 0;
    return tgt;
  },
  [ephemeral](src, tgt) {
    const content  = [] as string[];
    tgt.flags      = src.props.flags ? 64 ^ src.props.flags : 64;
    tgt.components = [];
    for (const child of src.children) {
      switch (child.type) {
        case select:
        case users:
        case roles:
        case channels:
        case mentions:
          delete child.data.required;
          tgt.components.push({
            type      : 1,
            components: [child.data],
          });
          break;
        default:
          tgt.components.push(child.data as any);
      }
    }
    tgt.content = content.join('');
    return tgt;
  },
  [label](src, tgt) {
    const child = src.children[0];
    switch (child.type) {
      case select:
      case users:
      case roles:
      case channels:
      case mentions:
        delete child.data.disabled;
    }
    tgt.id          = src.props.id ?? 0;
    tgt.type        = 18;
    tgt.label       = src.props.label;
    tgt.description = src.props.description as any;
    tgt.component   = child.data;
    return tgt;
  },
  [textarea](src, tgt) {
    tgt.id          = src.props.id ?? 0;
    tgt.type        = 4;
    tgt.style       = src.props.long ? 2 : 1;
    tgt.custom_id   = src.props.custom_id ?? src.step;
    tgt.value       = src.props.value as any;
    tgt.placeholder = src.props.placeholder as any;
    tgt.min_length  = src.props.min ?? 0;
    tgt.max_length  = src.props.max ?? 4000;
    tgt.required    = src.props.required ?? false;
    return tgt;
  },
  [upload](src, tgt) {
    tgt.id         = src.props.id ?? 0;
    tgt.type       = 19;
    tgt.custom_id  = src.props.custom_id ?? src.step;
    tgt.min_values = src.props.min ?? 0;
    tgt.max_values = src.props.max ?? 1;
    tgt.required   = src.props.required ?? false;
    return tgt;
  },
  [modal](src, tgt) {
    tgt.custom_id  = src.props.custom_id ?? src.step;
    tgt.title      = src.props.title;
    tgt.components = src.children.map((c) => c.data);
    return tgt;
  },
};

const validators = {};

export const validateAttributes = (jsx: Jsx.Jsx) => {

};

export const transform = (jsx: Jsx.Jsx, children: any[]) => {};

export interface IntrinsicElements {
  a         : typeof MarkdownAnchorProps.Type;
  at        : typeof MarkdownMentionProps.Type;
  time      : typeof MarkdownTimestampProps.Type;
  b         : typeof MarkdownProps.Type;
  i         : typeof MarkdownProps.Type;
  s         : typeof MarkdownProps.Type;
  u         : typeof MarkdownProps.Type;
  code      : typeof MarkdownProps.Type;
  details   : typeof MarkdownProps.Type;
  br        : typeof MarkdownProps.Type;
  p         : typeof MarkdownProps.Type;
  blockquote: typeof MarkdownProps.Type;
  pre       : typeof MarkdownCodeBlockProps.Type;
  h1        : typeof MarkdownHeadingProps.Type;
  h2        : typeof MarkdownHeadingProps.Type;
  h3        : typeof MarkdownHeadingProps.Type;
  small     : typeof MarkdownHeadingProps.Type;
  ol        : typeof MarkdownListingProps.Type;
  ul        : typeof MarkdownListingProps.Type;
  li        : typeof MarkdownListingProps.Type;
  embed     : typeof EmbedProps.Type;
  author    : typeof EmbedAuthorProps.Type;
  field     : typeof EmbedFieldProps.Type;
  footer    : typeof EmbedFooterProps.Type;
  buttons   : typeof ButtonRowProps.Type;
  primary   : typeof ButtonPrimaryProps.Type;
  secondary : typeof ButtonSecondaryProps.Type;
  success   : typeof ButtonSuccessProps.Type;
  danger    : typeof ButtonDangerProps.Type;
  link      : typeof ButtonLinkProps.Type;
  premium   : typeof ButtonPremiumProps.Type;
  select    : typeof MenuStringProps.Type;
  option    : typeof MenuOptionProps.Type;
  users     : typeof MenuUsersProps.Type;
  roles     : typeof MenuRolesProps.Type;
  channels  : typeof MenuChannelsProps.Type;
  mentions  : typeof MenuMentionsProps.Type;
  value     : typeof MenuValueProps.Type;
  separator : typeof LayoutSeparatorProps.Type;
  section   : typeof LayoutSectionProps.Type;
  container : typeof LayoutContainerProps.Type;
  gallery   : typeof LayoutMediaGalleryProps.Type;
  display   : typeof LayoutTextDisplayProps.Type;
  thumbnail : typeof LayoutThumbnailProps.Type;
  file      : typeof LayoutFileProps.Type;
  message   : typeof MessageProps.Type;
  ephemeral : typeof EphemeralProps.Type;
  label     : typeof ModalLabelProps.Type;
  textarea  : typeof ModalTextInputProps.Type;
  upload    : typeof ModalFileUploadProps.Type;
  modal     : typeof ModalProps.Type;
}
