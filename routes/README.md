# Services Folder

服务定义了应用程序中的路由。Fastify提供了通往微服务架构的简便方法，将来您可能希望独立部署其中一些服务。 

在此文件夹中，您应该定义所有服务及其路由。每个服务都是一个[Fastify 插件](https://www.fastify.io/docs/latest/Plugins/), 它被封装 (可以有自己的独立插件)，并且通常存储在一个文件中; 

如果单个文件太大，则创建一个文件夹并在其中添加一个`index.js`文件:
该文件必须是Fastify插件，应用程序会自动加载该插件。你可以在该文件夹中添加任意数量的文件。这样，您可以在单个整体中创建复杂的服务，并最终将它们提取出来。

如果您需要在服务之间共享功能，请将其放入`plugins`文件夹 , 然后通过[装饰器 decorators](https://www.fastify.io/docs/latest/Decorators/)进行共享。