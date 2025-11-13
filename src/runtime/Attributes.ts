import * as S from 'effect/Schema';

export const Anchor = S.Struct({
  href    : S.String,
  embed   : S.optional(S.Boolean),
  children: S.optional(S.Any),
});

export interface HereMention {
  here: true;
}

export const AtMention = S.Union(
  S.Struct({here: S.Boolean}),
  S.Struct({everyone: S.Boolean}),
  S.Struct({user: S.String}),
  S.Struct({role: S.String}),
  S.Struct({channel: S.String}),
);

export const Markdown = S.Struct({
  children: S.optional(S.Any),
});

export const CodeBlock = S.Struct({
  lang    : S.optional(S.String),
  children: S.String,
});

export const Embed = S.Struct({
  title    : S.optional(S.String),
  url      : S.optional(S.String),
  color    : S.optional(S.Number),
  timestamp: S.optional(S.String),
  children : S.optional(S.Any),
});

export const EmbedAuthor = S.Struct({
  name: S.String,
  url : S.optional(S.String),
});

export const EmbedFooter = S.Struct({
  text    : S.optional(S.String),
  children: S.optional(S.Any),
});

export const EmbedField = S.Struct({
  name  : S.String,
  value : S.String,
  inline: S.optional(S.Boolean),
});

const Handler = S.declare((u): u is () => {} => typeof u === 'function');

export const Emoji = S.Struct({
  id      : S.optional(S.String),
  name    : S.optional(S.String),
  animated: S.optional(S.Boolean),
});

export const ButtonPrimary = S.Struct({
  custom_id: S.optional(S.String),
  label    : S.optional(S.String),
  emoji    : S.optional(Emoji),
  disabled : S.optional(S.Boolean),
  onClick  : S.optional(Handler),
});

export const ButtonSecondary = S.Struct(ButtonPrimary.fields);

export const ButtonSuccess = S.Struct(ButtonPrimary.fields);

export const ButtonDanger = S.Struct(ButtonPrimary.fields);

export const ButtonLink = S.Struct({
  url     : S.String,
  label   : S.optional(S.String),
  emoji   : S.optional(S.String),
  disabled: S.optional(S.Boolean),
});

export const ButtonPremium = S.Struct({
  sku_id  : S.String,
  disabled: S.optional(S.Boolean),
});

export const ButtonRow = S.Struct({
  children: S.Union(S.Array(S.Any), S.Any),
});

export const MenuOption = S.Struct({
  value      : S.String,
  label      : S.String,
  description: S.optional(S.String),
  emoji      : S.optional(Emoji),
  default    : S.optional(S.Boolean),
});

export const MenuString = S.Struct({
  custom_id  : S.optional(S.String),
  placeholder: S.optional(S.String),
  required   : S.optional(S.Boolean),
  disabled   : S.optional(S.Boolean),
  min_values : S.optional(S.Number),
  max_values : S.optional(S.Number),
  onSelect   : S.optional(Handler),
  children   : S.optional(S.Any),
});

export const MenuValue = S.Union(
  S.Struct({user: S.String}),
  S.Struct({role: S.String}),
  S.Struct({channel: S.String}),
);

export const MenuUsers = S.Struct({
  ...MenuString.omit('onSelect').fields,
  onSelect: S.optional(Handler),
  children: S.optional(S.Any),
});

export const MenuRoles = S.Struct({
  ...MenuString.omit('onSelect').fields,
  onSelect: S.optional(Handler),
  children: S.optional(S.Any),
});

export const MenuChannels = S.Struct({
  ...MenuString.omit('onSelect').fields,
  channel_types: S.optional(S.Array(S.Number)),
  onSelect     : S.optional(Handler),
  children     : S.optional(S.Any),
});

export const MenuMentions = S.Struct({
  ...MenuString.omit('onSelect').fields,
  onSelect: S.optional(Handler),
  children: S.optional(S.Any),
});

export const Separator = S.Struct({});

export const Section = S.Struct({
  children: S.optional(S.Any),
});

export const Container = S.Struct({
  children: S.optional(S.Any),
});

export const MediaGallery = S.Struct({
  children: S.optional(S.Any),
});

export const FileComponent = S.Struct({});

export const Thumbnail = S.Struct({
  children: S.optional(S.Any),
});

export const TextDisplay = S.Struct({
  children: S.optional(S.Any),
});

export const Label = S.Struct({
  custom_id: S.optional(S.String),
  label    : S.String,
  children : S.optional(S.Any),
});

export const FileUpload = S.Struct({
  custom_id: S.optional(S.String),
});

export const TextInput = S.Struct({
  custom_id  : S.optional(S.String),
  style      : S.optional(S.Literal('short', 'paragraph')),
  label      : S.optional(S.String),
  value      : S.optional(S.String),
  placeholder: S.optional(S.String),
  required   : S.optional(S.Boolean),
  disabled   : S.optional(S.Boolean),
  min_length : S.optional(S.Number),
  max_length : S.optional(S.Number),
});

export const Message = S.Struct({
  public  : S.optional(S.Boolean),
  v2      : S.optional(S.Boolean),
  children: S.optional(S.Any),
});

export const MessageTags = S.Literal(
  Tag.buttons,
  Tag.select,
  Tag.users,
  Tag.roles,
  Tag.channels,
  Tag.mentions,
);

import * as Tag from './Tag.js';

export const Modal = S.Struct({
  custom_id: S.optional(S.String),
  title    : S.String,
  children : S.optional(S.Any),
});

export const ModalTags = S.Literal(
  Tag.label,
  Tag.textarea,
  Tag.select,
  Tag.users,
  Tag.roles,
  Tag.channels,
  Tag.mentions,
);
