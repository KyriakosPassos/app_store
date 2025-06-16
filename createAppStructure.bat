@echo off
cd src\apps
mkdir %1 %1\client\ui %1\client\ui\components %1\client\ui\pages %1\client\graphql %1\server\graphql %1\server\resolvers %1\server\services
cd %1\client\ui\pages
type nul > index.ts
set "Tab=  "
echo import React from 'react'; > index.ts
echo import { AppPagesStructure, AppStructure } from "@core/shared/types"; >> index.ts
echo import { FaHome, FaQuestion  } from "react-icons/fa"; >> index.ts
echo. >> index.ts
echo const pages: AppPagesStructure[] = [ >> index.ts
echo %TAB%{ >>index.ts
echo %TAB%%TAB%name: "", >> index.ts
echo %TAB%%TAB%icon: FaHome, >> index.ts
echo %TAB%%TAB%priority: 0, >> index.ts
echo %TAB%%TAB%route: "home", >> index.ts
echo %TAB%%TAB%component: React.lazy(()=^> import('./%1HomePage')), >> index.ts
echo %TAB%}, >>index.ts
echo ]; >> index.ts
echo. >> index.ts
echo const App: AppStructure = { >> index.ts
echo %TAB%app: "%1", >> index.ts
echo %TAB%appIcon: FaQuestion, >> index.ts
echo %TAB%pages: pages, >> index.ts
echo }; >> index.ts
echo. >> index.ts
echo export default App; >> index.ts
type nul > %1HomePage.tsx
echo const %1HomePage = (^) =^> { > %1HomePage.tsx
echo %TAB%return ^<^>^</^>; >> %1HomePage.tsx
echo }; >> %1HomePage.tsx
echo. >> %1HomePage.tsx
echo export default %1HomePage; >> %1HomePage.tsx
cd ../../../server/resolvers/
type nul > %1_resolver.ts
echo export default { > %1_resolver.ts
echo %TAB%Query: { >> %1_resolver.ts
echo %TAB%%TAB% getFrom%1: async () =^> { >> %1_resolver.ts
echo %TAB%%TAB%%TAB% return Promise.resolve().then(() =^> "Hi there %1"); >> %1_resolver.ts
echo %TAB%%TAB% }, >> %1_resolver.ts
echo %TAB% }, >> %1_resolver.ts
echo }; >> %1_resolver.ts
cd ../graphql
type nul > %1.schema.graphql
echo type Query { > %1.schema.graphql
echo %TAB%getFrom%1: String>> %1.schema.graphql
echo }>> %1.schema.graphql
cd ../../../../../
echo Created %1 app folder