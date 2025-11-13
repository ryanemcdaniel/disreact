import type * as v10 from 'discord-api-types/v10';
import * as S from 'effect/Schema';
import type * as Jsx from '../core/Jsx.js';
import * as Attributes from './Attributes.js';
import * as Tag from './Tag.js';

const JsxAttributes = {
  [Tag.a]         : [Attributes.Anchor],
  [Tag.at]        : [Attributes.AtMention],
  [Tag.b]         : [Attributes.Markdown],
  [Tag.i]         : [Attributes.Markdown],
  [Tag.s]         : [Attributes.Markdown],
  [Tag.u]         : [Attributes.Markdown],
  [Tag.code]      : [Attributes.Markdown],
  [Tag.details]   : [Attributes.Markdown],
  [Tag.br]        : [Attributes.Markdown],
  [Tag.p]         : [Attributes.Markdown],
  [Tag.blockquote]: [Attributes.Markdown],
  [Tag.pre]       : [Attributes.CodeBlock],
  [Tag.h1]        : [Attributes.Markdown],
  [Tag.h2]        : [Attributes.Markdown],
  [Tag.h3]        : [Attributes.Markdown],
  [Tag.small]     : [Attributes.Markdown],
  [Tag.ol]        : [Attributes.Markdown],
  [Tag.ul]        : [Attributes.Markdown],
  [Tag.li]        : [Attributes.Markdown],
  [Tag.embed]     : [Attributes.Embed],
  [Tag.author]    : [Attributes.EmbedAuthor],
  [Tag.field]     : [Attributes.EmbedField],
  [Tag.footer]    : [Attributes.EmbedFooter],
  [Tag.buttons]   : [Attributes.ButtonRow],
  [Tag.primary]   : [Attributes.ButtonPrimary],
  [Tag.secondary] : [Attributes.ButtonSecondary],
  [Tag.success]   : [Attributes.ButtonSuccess],
  [Tag.danger]    : [Attributes.ButtonDanger],
  [Tag.link]      : [Attributes.ButtonLink],
  [Tag.premium]   : [Attributes.ButtonPremium],
  [Tag.select]    : [Attributes.MenuString],
  [Tag.option]    : [Attributes.MenuOption],
  [Tag.users]     : [Attributes.MenuUsers],
  [Tag.roles]     : [Attributes.MenuRoles],
  [Tag.channels]  : [Attributes.MenuChannels],
  [Tag.mentions]  : [Attributes.MenuMentions],
  [Tag.value]     : [Attributes.MenuValue],
  [Tag.separator] : [Attributes.Separator],
  [Tag.section]   : [Attributes.Section],
  [Tag.container] : [Attributes.Container],
  [Tag.gallery]   : [Attributes.MediaGallery],
  [Tag.display]   : [Attributes.TextDisplay],
  [Tag.thumbnail] : [Attributes.Thumbnail],
  [Tag.label]     : [Attributes.Label],
  [Tag.textarea]  : [Attributes.TextInput],
  [Tag.message]   : [Attributes.Message],
  [Tag.ephemeral] : [Attributes.Message],
  [Tag.modal]     : [Attributes.Modal],
} as const;

const Markdown = [
  Tag.a,
Tag.at,
Tag.b,
Tag.i,
Tag.s,
Tag.u,
Tag.code,
Tag.details,
Tag.br,
Tag.p,
Tag.blockquote,
Tag.pre,
Tag.h1,
Tag.h2,
Tag.h3,
Tag.small,
Tag.ol,
Tag.ul,
Tag.li,
];

const JsxChildren = {
  [Tag.a]         : Markdown,
  [Tag.at]        : undefined,
  [Tag.b]         : Markdown,
  [Tag.i]         : Markdown,
  [Tag.s]         : Markdown,
  [Tag.u]         : Markdown,
  [Tag.code]      : '',
  [Tag.details]   : Markdown,
  [Tag.br]        : undefined,
  [Tag.p]         : Markdown,
  [Tag.blockquote]: Markdown,
  [Tag.pre]       : '',
  [Tag.h1]        : '',
  [Tag.h2]        : '',
  [Tag.h3]        : '',
  [Tag.small]     : '',
  [Tag.ol]        : Markdown,
  [Tag.ul]        : Markdown,
  [Tag.li]        : Markdown,
  [Tag.embed]     : [Tag.author, Tag.field, Tag.footer],
  [Tag.author]    : undefined,
  [Tag.field]     : undefined,
  [Tag.footer]    : undefined,
  [Tag.buttons]   : [Tag.primary, Tag.secondary, Tag.success, Tag.danger, Tag.link, Tag.premium],
  [Tag.primary]   : undefined,
  [Tag.secondary] : undefined,
  [Tag.success]   : undefined,
  [Tag.danger]    : undefined,
  [Tag.link]      : undefined,
  [Tag.premium]   : undefined,
  [Tag.select]    : undefined,
  [Tag.option]    : undefined,
  [Tag.users]     : undefined,
  [Tag.roles]     : undefined,
  [Tag.channels]  : undefined,
  [Tag.mentions]  : undefined,
  [Tag.value]     : undefined,
  [Tag.separator] : undefined,
  [Tag.section]   : [],
  [Tag.container] : [],
  [Tag.gallery]   : [],
  [Tag.display]   : Markdown,
  [Tag.thumbnail] : undefined,
  [Tag.label]     : [Tag.textarea],
  [Tag.textarea]  : undefined,
  [Tag.message]   : [...Markdown, Tag.embed, Tag.buttons, Tag.select, Tag.users, Tag.roles, Tag.channels, Tag.mentions, Tag.separator, Tag.section, Tag.container, Tag.gallery, Tag.display, Tag.thumbnail],
  [Tag.ephemeral] : [...Markdown, Tag.embed, Tag.buttons, Tag.select, Tag.users, Tag.roles, Tag.channels, Tag.mentions, Tag.separator, Tag.section, Tag.container, Tag.gallery, Tag.display, Tag.thumbnail],
  [Tag.modal]     : [Tag.label, Tag.textarea],
} as const;

export type JsxAttributes = {
  [K in keyof typeof JsxAttributes]: typeof JsxAttributes[K][0]['Type'];
};

type Transformed = {
  [Tag.a]         : string;
  [Tag.at]        : string;
  [Tag.b]         : string;
  [Tag.i]         : string;
  [Tag.s]         : string;
  [Tag.u]         : string;
  [Tag.code]      : string;
  [Tag.details]   : string;
  [Tag.br]        : string;
  [Tag.p]         : string;
  [Tag.blockquote]: string;
  [Tag.pre]       : string;
  [Tag.h1]        : string;
  [Tag.h2]        : string;
  [Tag.h3]        : string;
  [Tag.small]     : string;
  [Tag.ol]        : {level: number; data: string};
  [Tag.ul]        : {level: number; data: string};
  [Tag.li]        : {level: number; data: string};
  [Tag.embed]     : v10.APIEmbed;
  [Tag.author]    : v10.APIEmbedAuthor;
  [Tag.field]     : v10.APIEmbedField;
  [Tag.footer]    : v10.APIEmbedFooter;
  [Tag.buttons]   : v10.APIButtonComponent[];
  [Tag.primary]   : v10.APIButtonComponent;
  [Tag.secondary] : v10.APIButtonComponent;
  [Tag.success]   : v10.APIButtonComponent;
  [Tag.danger]    : v10.APIButtonComponent;
  [Tag.link]      : v10.APIButtonComponent;
  [Tag.premium]   : v10.APIButtonComponent;
  [Tag.select]    : v10.APIStringSelectComponent;
  [Tag.option]    : v10.APISelectMenuOption;
  [Tag.users]     : v10.APIUserSelectComponent;
  [Tag.roles]     : v10.APIRoleSelectComponent;
  [Tag.channels]  : v10.APIChannelSelectComponent;
  [Tag.mentions]  : v10.APIMentionableSelectComponent;
  [Tag.value]     : v10.APISelectMenuDefaultValue<v10.SelectMenuDefaultValueType>;
  [Tag.separator] : v10.APISeparatorComponent;
  [Tag.section]   : v10.APISectionComponent;
  [Tag.container] : v10.APIContainerComponent;
  [Tag.gallery]   : v10.APIMediaGalleryComponent;
  [Tag.display]   : v10.APITextDisplayComponent;
  [Tag.thumbnail] : v10.APIThumbnailComponent;
  [Tag.label]     : v10.APILabelComponent;
  [Tag.textarea]  : v10.APITextInputComponent;
  [Tag.message]   : v10.APIInteractionResponseCallbackData;
  [Tag.ephemeral] : v10.APIInteractionResponseCallbackData;
  [Tag.modal]     : v10.APIModalInteractionResponseCallbackData;
};

export const validateAttributes = (jsx: Jsx.Jsx) => {
  // @ts-expect-error unchecked index
  const schemas = JsxAttributes[jsx.type as any] as any;
  if (!schemas) {
    throw new Error(`No schema found for tag ${jsx.type}`);
  }
  const validator = S.validateSync(schemas[0]);
  return validator(jsx.props);
};
