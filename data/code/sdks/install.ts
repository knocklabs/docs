const languages = {
  javascript: `
    npm install @knocklabs/node
  `,
  python: `
    pip install knockapi
  `,
  ruby: `
    gem install knockapi
  `,
  go: `
    go get github.com/knocklabs/knock-go/knock
  `,
  php: `
    composer require knocklabs/knock-php php-http/guzzle7-adapter
  `,
  java: `
// To build.gradle:
  dependencies {
    implementation 'app.knock.api:knock-client:[VERSION]'
  }

// To maven.xml:
  <dependencies>
    <!-- more dependencies here -->
    <dependency>
      <groupId>app.knock.api</groupId>
      <artifactId>knock-client</artifactId>
      <version>[VERSION]</version>
    </dependency>
    <!-- more dependencies here -->
  </dependencies>
  `,
  csharp: `
// Via the NuGet Package Manager
  nuget install Knock.net

// Via the .NET Core Command Line Tools
  dotnet add package Knock.net

// Via Visual Studio IDE
  Install-Package Knock.net
  `,
  elixir: `
# Add to mix.exs
  def deps do
    [
      {:knock, "~> [VERSION]"}
    ]
  end
  `,
};

export default languages;
