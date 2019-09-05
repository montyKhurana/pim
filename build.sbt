name := """pim"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "public/ui" ** "*").get
)

resolvers += Resolver.sonatypeRepo("snapshots")

scalaVersion := "2.12.8"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.2" % Test
libraryDependencies += "com.h2database" % "h2" % "1.4.199"
libraryDependencies += "io.swagger" %% "swagger-play2" % "1.6.0"
libraryDependencies += "io.swagger" % "swagger-core" % "1.5.22"
libraryDependencies += "org.webjars" % "swagger-ui" % "3.13.0"
libraryDependencies += "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.9.8"
libraryDependencies += "com.typesafe.play" %% "play-slick" %  "3.0.2"
libraryDependencies += "com.typesafe.play" %% "play-slick-evolutions" % "3.0.2"
libraryDependencies += "org.postgresql" % "postgresql" % "9.4-1200-jdbc41"
libraryDependencies += "com.github.tminglei" %% "slick-pg" % "0.18.0"
libraryDependencies += "org.mockito" % "mockito-all" % "1.8.4"
libraryDependencies += specs2 % Test
libraryDependencies += evolutions