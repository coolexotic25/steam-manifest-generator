{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];
  env = {
    NODE_ENV = "production";
  };
}