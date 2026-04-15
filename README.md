# 📦 `@omnixys/graphql`

Shared GraphQL Types, Inputs, Enums und Federation-Objekte für das Omnixys Microservice-Ökosystem.

Dieses Package stellt eine zentrale, wiederverwendbare GraphQL-Schema-Definition für alle TypeScript-basierten Omnixys-Services bereit (NestJS, Federation Subgraphs, Gateway).

---

## 🎯 Zweck

`@omnixys/graphql` dient als **Transport-Layer-Definition** zwischen Services.

Es enthält:

- ✅ `@InputType()` Klassen
- ✅ `@ObjectType()` Klassen
- ✅ `@ArgsType()` Klassen
- ✅ `@Enum()` Registrierungen
- ✅ Federation Directives (`@key`, etc.)
- ❌ Keine Business-Logik
- ❌ Kein Prisma
- ❌ Kein Kafka
- ❌ Keine Service-spezifischen Implementierungen

---

## 🧠 Architekturrolle

In der Omnixys-Architektur ist dieses Package:

```text
@omnixys/contracts   → Domain + Events (framework-agnostisch)
@omnixys/graphql     → GraphQL Transport Schema
Service Layer        → Business Logic
Infrastructure       → DB, Kafka, Cache
```

Alle Services kommunizieren ausschließlich über GraphQL (siehe OmnixysSphere Architektur) .

---

## 📂 Struktur

```text
src/
├── address/
│   ├── address.input.ts
│   ├── address.object.ts
│   └── index.ts
│
├── user/
│   ├── user.input.ts
│   ├── user.object.ts
│   └── index.ts
│
├── common/
│   ├── pagination.args.ts
│   ├── base-response.object.ts
│   └── index.ts
│
├── enums/
│   ├── address-type.enum.ts
│   └── index.ts
│
└── index.ts
```

---

## 📦 Installation

```bash
pnpm add @omnixys/graphql
```

Oder bei Workspace:

```bash
pnpm add @omnixys/graphql -w
```

---

## 🚀 Beispiel: AddressInput

```ts
import { Field, ID, InputType } from "@nestjs/graphql";
import { AddressType } from "@omnixys/shared";

@InputType()
export class AddressInput {
  @Field()
  street!: string;

  @Field()
  houseNumber!: string;

  @Field(() => ID)
  postalCodeId!: string;

  @Field(() => ID)
  cityId!: string;

  @Field(() => ID, { nullable: true })
  stateId?: string;

  @Field(() => ID)
  countryId!: string;

  @Field(() => AddressType)
  addressType!: AddressType;
}
```

---

## 🏗 Verwendung im Service

```ts
import { AddressInput } from '@omnixys/graphql';

@Mutation(() => Boolean)
createAddress(
  @Args('input') input: AddressInput,
) {
  return this.addressService.create(input);
}
```

Keine DTO-Duplizierung.
Kein Drift zwischen Services.
Zentrale Schema-Kontrolle.

---

## 🌐 Federation Support

Falls Subgraphs Federation nutzen:

```ts
@ObjectType()
@Directive('@key(fields: "id")')
export class Address {
  @Field(() => ID)
  id!: string;
}
```

Federation-Direktiven gehören ebenfalls in dieses Package, damit:

- Alle Subgraphs identische Entity-Definitionen nutzen
- Der Gateway konsistente Keys erhält

---

## ⚠ Design-Regeln

`@omnixys/graphql` darf:

- NestJS GraphQL verwenden
- Federation Directives verwenden
- Enums aus `@omnixys/contracts` importieren

`@omnixys/graphql` darf NICHT:

- Prisma importieren
- Services importieren
- Kafka importieren
- Business-Logik enthalten
- Environment-Variablen verwenden

Es ist rein deklarativ.

---

## 🔄 Versionierung

Da GraphQL-Schemas Breaking Changes verursachen können, gilt:

- Minor Version → neue Felder (nullable)
- Patch → interne Refactorings
- Major → Feld entfernt oder Typ geändert

Empfohlen: semantische Versionierung mit CI-Release-Pipeline.

---

## 🔐 Sicherheit

Security-Relevante Informationen (Tokens, interne Felder) dürfen nicht als GraphQL-Types exponiert werden.
Für Sicherheitsmeldungen siehe SECURITY.md .

---

## 📜 Lizenz

Dieses Package steht unter der GNU GPL v3.0 .

---

## ❤️ Ziel

Ein zentrales, konsistentes und versionskontrolliertes GraphQL-Schema
für das gesamte Omnixys-Ökosystem.
